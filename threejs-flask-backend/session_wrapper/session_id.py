from functools import wraps
from flask import flash
from flask import session
from flask import current_app as app
import random
import string

# https://stackoverflow.com/questions/32640090/python-flask-keeping-track-of-user-sessions-how-to-get-session-cookie-id/32643135#32643135
# https://flask.palletsprojects.com/en/2.0.x/quickstart/#sessions
# https://www.tutorialspoint.com/flask/flask_sessions.htm
def session_id_handler(fn_protected):
    @wraps(fn_protected)
    def id_wrap(*args, **kwargs):
        # print(f"keys: {session.keys()}")
        if 'temp_id' not in session:
            random_str = ''.join(random.choices(string.ascii_lowercase+string.digits, k=30))
            # print(random_str)
            session['temp_id'] = random_str
        # print(f"temp_id: {session['temp_id']}")
        return fn_protected(*args, **kwargs)
    return id_wrap

def session_id_blocker(fn_protected):
    @wraps(fn_protected)
    def block_no_id(*args, **kwargs):
        if 'temp_id' not in session:
            return None
        return fn_protected(*args, **kwargs)
    return block_no_id
