"""test: a module to test flask API functionality, with the end goal of storing and returning a word for Angular"""
from flask import Flask, jsonify, request, session, redirect, url_for
import pickle
from datetime import datetime
# from flask_cors import cross_origin
from flask_cors import CORS

from session_wrapper.session_id import session_id_handler

app = Flask(__name__)
# with app.appcontext: necessary
#  https://flask.palletsprojects.com/en/2.0.x/appcontext/#creating-an-application-context
#  https://stackoverflow.com/questions/31444036/runtimeerror-working-outside-of-application-context
with app.app_context():
    from db_dao.word_db import check_tables, close_connection, create_table, \
        drop_table, insert_row, get_table, commit_db, get_one_row, update_row, \
        delete_row
CORS(app, supports_credentials=True)
# app.secret_key = b'helllooo0000oooo00o0o0o0o0o'
app.config['SECRET_KEY'] = b'helllooo0000oooo00o0o0o0o0o'

# https://medium.com/@mushtaque87/flask-in-pycharm-community-edition-c0f68400d91e
# https://testdriven.io/courses/learn-flask/setting-up-a-flask-project/


@app.route('/')
def hello_world():
    """hello_world: a fun endpoint for home that greets you"""
    return 'hello there'


@app.route('/word-api', methods=['GET', 'POST'])
@session_id_handler
def word_api():
    if request.method == "GET":
        curr_cookie = session["temp_id"]
        # https: // www.educba.com / flask - url - parameters /
        delete_bool = request.args.get("delete")
        # test to see if deletion parameter present/true; if so delete row
        if delete_bool:
            print("deleting")
            delete_row("WORDS", "cookie", curr_cookie)
            commit_db()

        # using session cookie, query DB to get word choice
        vals_ret = get_one_row("WORDS", "cookie", curr_cookie)
        word_choice = None
        if vals_ret:
            word_choice = vals_ret[0][1]

        print(f"GET RESP: {vals_ret}")
        # must "commit" DB to persist changes made

        # close connection
        close_connection()
        return f"""
            <h3>Your current cookie is: {curr_cookie}<h3><br>
            <h3>Your current word is: {word_choice}<h3><br>
            <form method="POST">
                <label for="wordChoice">Enter A Word:</label><br>
                <input type="text" name="wordChoice" id="wordChoice">
                <input type="submit"></input>
            </form><br>
            <a href="/word-api?delete=true"><button>Clear Word</button></a>
        """
    else:
        # ensure that WORDS table is created
        tables_ret = check_tables()
        if "WORDS" not in tables_ret:
            create_table("WORDS")

        # get user word choice from HTML form
        word_choice = request.form["wordChoice"]
        # grab current session cookie, handled by session id decorator
        curr_cookie = session["temp_id"]
        # check for update or insert; if old selection already present, running update
        vals_ret = get_one_row("WORDS", "cookie", curr_cookie)
        if not vals_ret:
            insert_row("WORDS", {"cookie": curr_cookie, "word": word_choice})
        else:
            update_row("WORDS", "cookie", curr_cookie, "word", word_choice)

        # drop_table("WORDS")
        # must "commit" DB to persist changes made
        commit_db()
        # close connection
        close_connection()
        return f"""
            <h1>You chose {word_choice}</h1>
            <a href="/word-api"><button>Return</button></a>
            <a href="/word-api?delete=true"><button>Clear Word</button></a>
        """


# https://flask.palletsprojects.com/en/2.0.x/quickstart/#sessions
@app.route('/pickle-api', methods=['GET', 'POST'])
@session_id_handler
# @cross_origin()
def pickle_api():
    if "word_choice" not in session:
        session["word_choice"] = "Henlo, Worlmd"
    if request.method == "POST":
        session["word_choice"] = request.form['word']
    # todo delete me... none of this used really, just returning session id?
    if "temp_id" in session:
        session["word_choice"] = session["temp_id"]

    word_dict = {"pickle_time": session["word_choice"]}
    # cors https://dev.to/matheusguimaraes/fast-way-to-enable-cors-in-flask-servers-42p0
    response = jsonify(word_dict)
    # # https://stackoverflow.com/a/53345899/10432596
    response.headers.add('Access-Control-Allow-Headers',
                         "Origin, X-Requested-With, Content-Type, Accept, x-auth")
    return response




# https://www.geeksforgeeks.org/how-to-return-a-json-response-form-a-flask-api/
@app.route('/time-api', methods=['GET', 'POST'])
# @cross_origin()
def time_api():
    """time_api: endpoint of get-word, manage the word on screen for the ThreeJS canvas, should handle get or post
       eventually
    """
    if request.method == "GET":
        # test the pickle
        with open("in_a.pickle", "wb") as fil:
            pickle.dump(datetime.now().astimezone(), fil)
        with open("in_a.pickle", "rb") as fil:
            pickle_time = pickle.load(fil)
        print(f"it's pickle time! {pickle_time}")
        pickle_dict = {"pickle_time": pickle_time}
        # cors https://dev.to/matheusguimaraes/fast-way-to-enable-cors-in-flask-servers-42p0
        response = jsonify(pickle_dict)
        return response


if __name__ == "__main__":
    app.run(host="0.0.0.0")
