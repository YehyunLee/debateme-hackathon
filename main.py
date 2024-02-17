from flask import Flask, request, jsonify
import openai
import json

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
        prompts["Topic"] = response.choices[0].text.strip().strip('"')

    elif gamemode == 'crazy':
        response = openai.Completion.create(
            engine="gpt-3.5-turbo-instruct",
            prompt="Create a random debate topic with only one side. Do not add additional context or arguments.",
            max_tokens=100
        )
        prompts["Topic"] = response.choices[0].text.strip().strip('"')

    else:
        return json.dumps({"error": "Invalid gamemode. Choose either 'normal' or 'crazy'"}, indent=4)
    print(prompts)
    return prompts


def next_level(level: int) -> int:
    return round((4 * (level ** 3)) / 5)


def judge_debate_content(debate_topic, user_beginning_debate, gpt_response, users_reply,
                         gamemode="normal"):
    if gamemode == "normal":
        exp = 1000
    else:
        exp = 2000

    prompt = {
        "prompt": f"Debate Topic: {debate_topic}\nUser's Beginning Debate:\n{user_beginning_debate}\nGPT Response:\n{gpt_response}\nUser's Reply to GPT Response:\n{users_reply}\n\n"
                  f"Please provide feedback and scores for the following categories:\n- Argument Clarity:\n- Depth of Analysis:\n- "
                  f"Counterargument Consideration:\n- Engagement with Opposing Views:\n- Language and Tone:\n- "
                  f"Coherence and Flow:\n- Originality and Creativity:\n\nPlease provide detailed examples from the debate "
                  f"content to support your feedback.\n\nPlease provide ratings for each category on a scale of 1 to 10 in the following format:\n"
                  f"Argument Clarity: [Rating]\nDepth of Analysis: [Rating]\nCounterargument Consideration: [Rating]\n"
                  f"Engagement with Opposing Views: [Rating]\nLanguage and Tone: [Rating]\nCoherence and Flow: [Rating]\n"
                  f"Originality and Creativity: [Rating]\nAggregate Score: [Aggregate Score]\nExp gained: {exp}\n\n"
                  f"After evaluating, please structure your feedback in a JSON format.The gamemode is {gamemode}, if its crazy, please mark harsher for user debate mistakes and give higher points for users positive debate attributes\n",
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

    prompt = f"Debate topic: {debate_topic}\nOppose the following user transcript: \"{user_transcript}\"\nDifficulty Level: {difficulty_level}"

    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",
        prompt=prompt,
        max_tokens=1000
    )

    # Prepare the JSON response with opposing response and expected outcome
    response_json = {
        "opposing_response": response.choices[0].text.strip()
    }

    return json.dumps(response_json, indent=4)


@app.route('/generate_debate_prompts', methods=['POST'])
def generate_debate_prompts_route():
    data = request.get_json()
    gamemode = data.get('gamemode')
    interested_subjects = data.get('interested_subjects')

    prompts = generate_debate_prompts(gamemode, interested_subjects)
    return jsonify(prompts)


@app.route('/judge_debate_content', methods=['POST'])
def judge_debate_content_route():
    data = request.get_json()
    debate_topic = data.get('debate_topic')
    user_beginning_debate = data.get('user_beginning_debate')
    gpt_response = data.get('gpt_response')
    users_reply = data.get('users_reply')
    gamemode = data.get('gamemode', 'normal')

    feedback = judge_debate_content(debate_topic, user_beginning_debate, gpt_response, users_reply, gamemode)
    return jsonify(feedback)


@app.route('/generate_opposing_response', methods=['POST'])
def generate_opposing_response_route():
    data = request.get_json()
    debate_topic = data.get('debate_topic')
    user_transcript = data.get('user_transcript')
    elo = data.get('elo')

    opposing_response = generate_opposing_response(debate_topic, user_transcript, elo)
    return jsonify(opposing_response)


if __name__ == "__main__":
    app.run(debug=True)
