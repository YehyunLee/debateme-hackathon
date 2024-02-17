from flask import Flask, request, jsonify
import openai
import json
from database import database_access
from database_access import database_conn

database_instance = database_conn()

app = Flask(__name__)


openai.api_key = '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'


def generate_debate_prompts(gamemode, interested_subjects):
    prompts = {}

    if gamemode == 'normal':
        response = openai.Completion.create(
            engine="gpt-3.5-turbo-instruct",
            prompt=f"Create a debate topic based on {interested_subjects}? Only include the prompt, do not include any arguments or additional context.",
            max_tokens=100
        )
        prompts["Topic"] = response.choices[0].text.strip()

    elif gamemode == 'crazy':
        response = openai.Completion.create(
            engine="gpt-3.5-turbo-instruct",
            prompt="Create a random debate topic with only one side. Do not add additional context or arguments.",
            max_tokens=100
        )
        prompts["Topic"] = response.choices[0].text.strip()

    else:
        return json.dumps({"error": "Invalid gamemode. Choose either 'normal' or 'crazy'"})

    return json.dumps(prompts, indent=4)

def increaseElo(user_id, actual_outcome, gamemode="normal"):
    cur_user_elo = database_instance.get_user_elo(user_id)[0]
    expected_outcome = cur_user_elo // 100 + 1 if cur_user_elo <= 1000 else 10
    if gamemode == "normal":
        added_elo = cur_user_elo + actual_outcome - expected_outcome
    else:
        added_elo = cur_user_elo + 2(actual_outcome - expected_outcome)
    database_instance.add_user_elo(user_id, added_elo)

def judge_debate_content(user_id, debate_topic, user_beginning_debate, gpt_response, users_reply, gamemode="normal"):
    if gamemode == "normal":
        exp = 1000
    else:
        exp = 2000
    cur_user_data = database_instance.get_user_info(user_id)
    cur_exp = cur_user_data[2] + exp
    cur_level = cur_user_data[1]
    while cur_exp >= next_level(cur_level):
        cur_exp -= next_level(cur_level)
        cur_level += 1
    database_instance.add_user_info(user_id, cur_level, cur_exp)

    prompt = {
        "prompt": f"Debate Topic: {debate_topic}\nUser's Beginning Debate:\n{user_beginning_debate}\nGPT Response:\n{gpt_response}\nUser's Reply to GPT Response:\n{users_reply}\n\n"
                  f"Please provide feedback and scores for the following categories:\n- Argument Clarity:\n- Depth of Analysis:\n- "
                  f"Counterargument Consideration:\n- Engagement with Opposing Views:\n- Language and Tone:\n- "
                  f"Coherence and Flow:\n- Originality and Creativity:\n\nPlease provide detailed examples from the debate "
                  f"content to support your feedback.\n\nPlease provide ratings for each category on a scale of 1 to 10 in the following format:\n"
                  f"Argument Clarity: [Rating]\nDepth of Analysis: [Rating]\nCounterargument Consideration: [Rating]\n"
                  f"Engagement with Opposing Views: [Rating]\nLanguage and Tone: [Rating]\nCoherence and Flow: [Rating]\n"
                  f"Originality and Creativity: [Rating]\nAggregate Score: [Aggregate Score]\n\n"
                  f"After evaluating, please structure your feedback in a JSON format.The gamemode is {gamemode}\n",
        "temperature": 0.7,
        "max_tokens": 1000,
    }

    try:
        response = openai.Completion.create(
            engine="gpt-3.5-turbo-instruct",
            prompt=prompt['prompt'],
            temperature=prompt['temperature'],
            max_tokens=prompt['max_tokens'],
        )

        response_json = response.choices[0].text.strip().rsplit('}', 1)[0] + '}'

        feedback_json = json.loads(response_json)

        feedback_json['feedback_text'] = response.choices[0].text.strip()
        return feedback_json

    except Exception as e:
        print(f"Error analyzing debate content: {e}")
        return None


def generate_opposing_response(debate_topic, user_transcript, elo):
    difficulty_level = elo // 100 + 1 if elo <= 1000 else 10

    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",
        prompt=f"Debate topic: {debate_topic} Oppose the following user transcript: {user_transcript} Difficulty Level: {difficulty_level}",
        max_tokens=1000
    )

    return json.dumps({"opposing_response": response.choices[0].text.strip()}, indent=4)

def next_level(level: int) -> int:
    return round((4 * (level ** 3)) / 5)

@app.route('/generate_prompts', methods=['POST'])
def generate_prompts():
    data = request.json
    gamemode = data.get('gamemode')
    interested_subjects = data.get('interested_subjects')
    return generate_debate_prompts(gamemode, interested_subjects)


@app.route('/judge_debate', methods=['POST'])
def judge_debate():
    data = request.json
    debate_topic = data.get('debate_topic')
    user_beginning_debate = data.get('user_beginning_debate')
    gpt_response = data.get('gpt_response')
    users_reply = data.get('users_reply')
    gamemode = data.get('gamemode')
    return jsonify(judge_debate_content(debate_topic, user_beginning_debate, gpt_response, users_reply, gamemode))


@app.route('/generate_opposing_response', methods=['POST'])
def generate_response():
    data = request.json
    debate_topic = data.get('debate_topic')
    user_transcript = data.get('user_transcript')
    elo = data.get('elo')
    return generate_opposing_response(debate_topic, user_transcript, elo)

@app.route('/add_user_elo', methods=['POST'])
def add_elo():
    data = request.json
    user_id = data.get('user_id')
    actual_outcome = data.get('actual_outcome')
    gamemode = data.get('gamemode')
    increaseElo(user_id, actual_outcome, gamemode)
    return "elo added"


if __name__ == '__main__':
    app.run(debug=True)
