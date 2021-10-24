"""test: a module to test flask API functionality, with the end goal of storing and returning a word for Angular"""
from flask import Flask, jsonify, request
import pickle
from datetime import datetime
from flask_cors import cross_origin
app = Flask(__name__)

# https://medium.com/@mushtaque87/flask-in-pycharm-community-edition-c0f68400d91e
# https://testdriven.io/courses/learn-flask/setting-up-a-flask-project/


@app.route('/')
def hello_world():
    """hello_world: a fun endpoint for home that greets you"""
    return 'hello there'


# https://www.geeksforgeeks.org/how-to-return-a-json-response-form-a-flask-api/
@app.route('/word-api', methods=['GET', 'POST'])
@cross_origin()
def word_api():
    """word_api: endpoint of get-word, manage the word on screen for the ThreeJS canvas, should handle get or post
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
