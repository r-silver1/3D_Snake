"""test: a module to test flask API functionality, with the end goal of storing and returning a word for Angular"""
from flask import Flask, jsonify, request, session
import pickle
from datetime import datetime
from flask_cors import cross_origin

from session_wrapper.session_id import session_id_handler

app = Flask(__name__)
app.secret_key = b'helllooo0000oooo00o0o0o0o0o'

# https://medium.com/@mushtaque87/flask-in-pycharm-community-edition-c0f68400d91e
# https://testdriven.io/courses/learn-flask/setting-up-a-flask-project/


@app.route('/')
def hello_world():
    """hello_world: a fun endpoint for home that greets you"""
    return 'hello there'

# https://flask.palletsprojects.com/en/2.0.x/quickstart/#sessions
@app.route('/word-api', methods=['GET', 'POST'])
@session_id_handler
@cross_origin()
def word_api():
    if "word_choice" not in session:
        session["word_choice"] = "Henlo, Worlmd"
    if request.method == "POST":
        session["word_choice"] = request.form['word']
    # todo delete me
    if "temp_id" in session:
        session["word_choice"] = session["temp_id"]
    # return f"""
    # <h1>{session['word_choice']}</h1>
    # <form method="post">
    #     input word: <input label="word_input" type="text" name="word">
    # </form>
    # """
    word_dict = {"pickle_time": session["word_choice"]}
    # cors https://dev.to/matheusguimaraes/fast-way-to-enable-cors-in-flask-servers-42p0
    response = jsonify(word_dict)
    # # https://stackoverflow.com/a/53345899/10432596
    # response.headers.add('Access-Control-Allow-Headers',
    #                      "Origin, X-Requested-With, Content-Type, Accept, x-auth")
    return response


# https://www.geeksforgeeks.org/how-to-return-a-json-response-form-a-flask-api/
@app.route('/time-api', methods=['GET', 'POST'])
@cross_origin()
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
