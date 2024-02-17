import json
import psycopg2
from psycopg2 import ProgrammingError

with open("config.json", "r") as f:
    config_file = json.load(f)

database_name = config_file["database"]["dbname"]
username = config_file["database"]["user"]
database_password = config_file["database"]["password"]
database_host = config_file["database"]["host"]
database_port = config_file["database"]["port"]

# data

class database_conn:
    def __init__(self):
        # establishes connection to the database server
        self.conn = psycopg2.connect(
            dbname=database_name,
            user=username,
            password=database_password,
            host=database_host,
            port=database_port
        )
        self.cur = self.conn.cursor()

        # prevents errors of corrupting the conn from previous runs
        self.conn.rollback()

        self.conn.autocommit = True

        self._create_tables()

    def _create_tables(self):
        try:
            self.cur.execute("CREATE TABLE IF NOT EXISTS users_login (user_id SERIAL PRIMARY KEY, username VARCHAR(255) NOT NULL);")
            self.cur.execute("CREATE TABLE IF NOT EXISTS users_info (user_id SERIAL PRIMARY KEY, level INTEGER NOT NULL, exp INTEGER NOT NULL);")
            self.cur.execute("CREATE TABLE IF NOT EXISTS users_winrate (user_id SERIAL PRIMARY KEY, wins INTEGER NOT NULL, losses INTEGER NOT NULL, dpa FLOAT NOT NULL);")
            self.cur.execute("CREATE TABLE IF NOT EXISTS users_interests (user_id INTEGER, interest VARCHAR(255) NOT NULL);")
            self.cur.execute("CREATE TABLE IF NOT EXISTS users_elo (user_id SERIAL PRIMARY KEY, elo INTEGER NOT NULL);")
            print("Databases created successfully")
        except ProgrammingError as e:
            print("Error creating tables:", e)

    def get_all_user(self) -> list:
        """
        Gets all the user_ids in the database

        format of the output: [(125,)]
        """
        self.cur.execute("SELECT user_id FROM users_login")
        responses = self.cur.fetchall()
        return responses

    def add_user_login(self, user_id: int, username: str):
        """
        Add user login information, any duplicate user_ids will be updated

        Parameters:
            user_id (int): The ID of the user.
            username (str): The username of the user.
            password (str): The password of the user.
        """
        # Check if the user exists
        self.cur.execute("SELECT COUNT(*) FROM users_login WHERE user_id = %s;", (user_id,))
        count = self.cur.fetchone()[0]
        if count == 0:
            # The user does not exist, insert a new record
            self.cur.execute("INSERT INTO users_login (user_id, username) VALUES (%s, %s);", (user_id, username))
        else:
            # The user exists, update the existing record
            self.cur.execute("UPDATE users_login SET username = %s WHERE user_id = %s;", (username, user_id))
        self.conn.commit()

    def add_user_elo(self, user_id: int, elo: int):
        """
        Add user elo information, any duplicataes user_ids will be updated instead

        Parameters:
            user_id (int): The ID of the user.
            elo (int): The elo of the user.
        """
        self.cur.execute("SELECT COUNT(*) FROM users_elo WHERE user_id = %s;", (user_id,))
        count = self.cur.fetchone()[0]
        if count == 0:
            self.cur.execute("INSERT INTO users_elo (user_id, elo) VALUES (%s, %s);", (user_id, elo))
        else:
            self.cur.execute("UPDATE users_elo SET elo = %s WHERE user_id = %s;", (elo, user_id))
        self.conn.commit()


    def add_user_info(self, user_id: int, level: int, exp: int):
        """
        Add user information, any duplicate user_ids will be updated.

        Parameters:
            user_id (int): The ID of the user.
            level (int): The level of the user.
            exp (int): The experience points of the user.
        """
        # Check if the user exists
        self.cur.execute("SELECT COUNT(*) FROM users_info WHERE user_id = %s;", (user_id,))
        count = self.cur.fetchone()[0]
        if count == 0:
            # The user does not exist, insert a new record
            self.cur.execute("INSERT INTO users_info (user_id, level, exp) VALUES (%s, %s, %s);", (user_id, level, exp))
        else:
            # The user exists, update the existing record
            self.cur.execute("UPDATE users_info SET level = %s, exp = %s WHERE user_id = %s;", (level, exp, user_id))
        self.conn.commit()

    def add_user_winrate(self, user_id: int, wins: int, losses: int, dpa: float):
        """
        Add user winrate information, any duplicate user_ids will be updated instead

        Parameters:
            user_id (int): The ID of the user.
            wins (int): The number of wins of the user.
            losses (int): The number of losses of the user.
            dpa (float): The damage per attack of the user.
        """
        # Check if the user exists
        self.cur.execute("SELECT COUNT(*) FROM users_winrate WHERE user_id = %s;", (user_id,))
        count = self.cur.fetchone()[0]
        if count == 0:
            # The user does not exist, insert a new record
            self.cur.execute("INSERT INTO users_winrate (user_id, wins, losses, dpa) VALUES (%s, %s, %s, %s);", (user_id, wins, losses, dpa))
        else:
            # The user exists, update the existing record
            self.cur.execute("UPDATE users_winrate SET wins = %s, losses = %s, dpa = %s WHERE user_id = %s;", (wins, losses, dpa, user_id))
        self.conn.commit()

    def add_user_interest(self, user_id: int, interest: str):
        """
        Add user interest, any duplicates will be ignored

        Parameters:
            user_id (int): The ID of the user.
            interest (str): The interest of the user.
        """
        self.cur.execute("SELECT COUNT(*) FROM users_interests WHERE user_id = %s AND interest = %s;", (user_id, interest))
        count = self.cur.fetchone()[0]
        if count == 0:
            # only add into the database there's no other instances
            self.cur.execute("INSERT INTO users_interests (user_id, interest) VALUES (%s, %s);", (user_id, interest))
            self.conn.commit()


    def get_user_login(self, user_id: int):
        """
        Get user login information.

        Parameters:
            user_id (int): The ID of the user.
        Returns:
            tuple: A tuple containing the username and password of the user.
        """
        self.cur.execute("SELECT username FROM users_login WHERE user_id = %s;", (user_id,))
        response = self.cur.fetchone()
        return response

    def get_user_info(self, user_id: int) -> tuple:
        """
        Get user information.

        Parameters:
            user_id (int): The ID of the user.
        Returns:
            tuple: A tuple containing the level, experience points, and maximum experience points of the user.
        """
        self.cur.execute("SELECT level, exp FROM users_info WHERE user_id = %s;", (user_id,))
        response = self.cur.fetchone()
        return response

    def get_user_elo(self, user_id: int) -> tuple:
        # do something here
        self.cur.execute("SELECT elo FROM users_elo WHERE user_id = %s;", (user_id,))
        response = self.cur.fetchone()
        return response

    def get_user_winrate(self, user_id: int) -> tuple:
        """
        Get user winrate information.

        Parameters:
            user_id (int): The ID of the user.
        Returns:
            tuple: A tuple containing the number of wins, losses, and debate point average of the user.
        """
        self.cur.execute("SELECT wins, losses, dpa FROM users_winrate WHERE user_id = %s;", (user_id,))
        response = self.cur.fetchone()
        return response

    def get_user_interests(self, user_id: int) -> list:
        """
        Get user interests.
        Parameters:
            user_id (int): The ID of the user.
        Returns:
            list: A list of tuples containing the user interests.
        """
        self.cur.execute("SELECT * FROM users_interests WHERE user_id = %s;", (user_id,))
        response = self.cur.fetchall()
        return response

    def _check_db(self) -> None:
        # don't use this function, only used for testing
        self.cur.execute("SELECT * FROM users_login");
        response = self.cur.fetchall()
        for thing in response:
            print(thing)

    def _delete_all_tables(self) -> None:
        # don't use this function, only used for testing
        self.cur.execute("DROP TABLE IF EXISTS users_login;")
        self.cur.execute("DROP TABLE IF EXISTS users_info;")
        self.cur.execute("DROP TABLE IF EXISTS users_winrate;")
        self.cur.execute("DROP TABLE IF EXISTS users_interests;")
        self.cur.execute("DROP TABLE IF EXISTS users_elo;")

