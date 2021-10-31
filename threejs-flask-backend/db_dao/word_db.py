import sqlite3
# https://stackoverflow.com/a/31279205/10432596
from flask import g
from flask import current_app as app

__DB_PATH__ = "../tables/word_table.db"
# https://flask.palletsprojects.com/en/2.0.x/patterns/sqlite3/
# https://docs.python.org/3/library/sqlite3.html


def get_db():
    db_con = getattr(g, '_database', None)
    if db_con is None:
        db_con = g._database = sqlite3.connect(__DB_PATH__)
    return db_con


# todo why in tutorial were they taking "exception" parameter?
@app.teardown_appcontext
def close_connection():
    db_con = getattr(g, '_database', None)
    if db_con is not None:
        db_con.close
