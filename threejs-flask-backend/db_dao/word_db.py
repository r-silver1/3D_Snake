import sqlite3
# https://stackoverflow.com/a/31279205/10432596
from flask import g
from flask import current_app as app
import traceback

# have to use path relative to setup.py?
__DB_PATH__ = "./tables/word_table.db"
# https://flask.palletsprojects.com/en/2.0.x/patterns/sqlite3/
# https://docs.python.org/3/library/sqlite3.html


def get_db():
    db_con = getattr(g, '_database', None)
    if db_con is None:
        db_con = g._database = sqlite3.connect(__DB_PATH__)
    return db_con


def check_tables():
    # https://www.geeksforgeeks.org/how-to-list-tables-using-sqlite3-in-python/
    try:
        db_con = get_db()
        db_query = """SELECT name FROM sqlite_master WHERE type='table';"""
        db_cursor = db_con.cursor()
        db_cursor.execute(db_query)
        table_names = db_cursor.fetchall()
        print(f"names : {table_names}")
        return table_names
    except sqlite3.Error as err:
        print(f"error in check tables: {err}")
        print(traceback.format_exc())


def create_table(name):
    try:
        db_con = get_db()
        table_qur = f""" CREATE TABLE IF NOT EXISTS {name} (
                        cookie TEXT NOT NULL PRIMARY KEY,
                        word TEXT
                    ); """
        resp = db_con.execute(table_qur)
        print("CREATE RESP: ", resp.fetchall())

    except sqlite3.Error as err:
        print(f"error in create_table: {err}")
        print(traceback.format_exc())


def drop_table(name):
    try:
        db_con = get_db()
        drop_qur = f"""DROP TABLE IF EXISTS {name}"""
        db_cur = db_con.cursor()
        resp = db_cur.execute(drop_qur)
        print("DROP RESP:", resp.fetchall())

    except sqlite3.Error as err:
        print(f"error in drop table: {err}")
        print(traceback.format_exc())


def get_table(name):
    try:
        db_con = get_db()
        select_qur = f"""SELECT * FROM {name};"""
        db_cur = db_con.cursor()
        db_cur.execute(select_qur)
        return db_cur.fetchall()

    except sqlite3.Error as err:
        print(f"error in get table: {err}")
        print(traceback.format_exc())


def get_one_row(name, pk_name, pk_value):
    try:
        db_con = get_db()
        select_qur = f"""SELECT * FROM {name} WHERE {pk_name}='{pk_value}';"""
        db_cur = db_con.cursor()
        db_cur.execute(select_qur)
        return db_cur.fetchall()

    except sqlite3.Error as err:
        print(f"error in get one row: {err}")
        print(traceback.format_exc())


def map_rownames(dict_ob):
    return ", ".join(map(lambda x: f"""'{x}'""", dict_ob.keys()))


def map_rowvals(dict_ob):
    return str(list(map(str, dict_ob.values())))[1:-1]


def insert_row(table_name, var_dict):
    # print(", ".join(map(lambda x: f"""'{x}'""", d1.keys())))
    # print(list(map(str, d1.values())))
    try:
        row_names = map_rownames(var_dict)
        row_vals = map_rowvals(var_dict)
        print("rowvals: ", row_vals)
        db_con = get_db()
        insert_qur = f"""INSERT INTO {table_name} VALUES ({row_vals})"""
        print(f"quer:\n{insert_qur}")
        db_cur = db_con.cursor()
        resp = db_cur.execute(insert_qur)
        print("INSERT RESP:", resp.fetchall())

    except sqlite3.Error as err:
        print(f"error in insert row: {err}")
        print(traceback.format_exc())


def update_row(table_name, pk_name, pk_val, up_name, up_val):
    try:
        db_con = get_db()
        update_qur = f"""UPDATE {table_name} SET {up_name}='{up_val}' WHERE {pk_name}='{pk_val}';"""
        print(f"update quer:\n{update_qur}")
        db_cur = db_con.cursor()
        resp = db_cur.execute(update_qur)
        print("UPDATE RESP:", resp.fetchall())

    except sqlite3.Error as err:
        print(f"error in update row: {err}")
        print(traceback.format_exc())


def delete_row(table_name, pk_name, pk_val):
    try:
        db_con = get_db()
        del_query = f"""DELETE FROM {table_name} WHERE {pk_name}='{pk_val}';"""
        print(f"update quer:\n{del_query}")
        db_cur = db_con.cursor()
        resp = db_cur.execute(del_query)
        print("DEL RESP:", resp.fetchall())

    except sqlite3.Error as err:
        print(f"error in delete row: {err}")
        print(traceback.format_exc())


def commit_db():
    db_con = getattr(g, '_database', None)
    if db_con is not None:
        db_con.commit()


# todo why in tutorial were they taking "exception" parameter?
# todo why is teardown appcontext passing in an arg, making args and kwargs necessary?
@app.teardown_appcontext
def close_connection(*args, **kwargs):
    db_con = getattr(g, '_database', None)
    if db_con is not None:
        db_con.close()
