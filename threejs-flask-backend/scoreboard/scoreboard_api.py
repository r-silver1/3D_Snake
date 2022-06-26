from flask import Flask, Blueprint, jsonify, request, session, redirect, url_for, current_app

# from db_dao.word_db import check_tables
from session_wrapper.session_id import session_id_handler

with current_app.app_context():
    from db_dao.word_db import check_tables, close_connection, create_table, \
        drop_table, insert_row, get_table, commit_db, get_one_row, update_row, \
        delete_row, create_score_table

scoreboard_api_blueprint = Blueprint('scoreboard_api', __name__, url_prefix="/scoreboard_api")


@scoreboard_api_blueprint.route('/get_scoreboard')
@session_id_handler
def get_scoreboard():
    if request.method == "GET":
        tables_ret = check_tables()
        score_table_name = "SCORETABLE"
        if score_table_name in [x[0] for x in tables_ret]:
            # print("table return")
            score_table_ret = get_table(score_table_name)
            close_connection()
            # print(score_table_ret)
            return jsonify(score_table_ret)
        close_connection()
        return jsonify({"error": "score table not found"})
    return jsonify({"error": "invalid request type"})


@scoreboard_api_blueprint.route('/post_score', methods=['POST'])
@session_id_handler
def post_score():
    if request.method == "POST":
        request_post_dict = request.get_json()
        name_val = request_post_dict.get('nameVal')
        score_val = request_post_dict.get('scoreVal')
        curr_cookie = session.get('temp_id')
        print(curr_cookie, name_val, score_val)
        if curr_cookie and name_val and score_val:
            tables_ret = check_tables()
            score_table_name = "SCORETABLE"
            # todo new logic score table name
            if score_table_name not in [x[0] for x in tables_ret]:
                print("creating table")
                create_score_table(score_table_name)
            # print("before tables")
            # print(tables_ret)

            var_dict = {"cookie": curr_cookie, "name": name_val, "score": score_val}
            insert_row(score_table_name, var_dict)
            # must commit to persist
            commit_db()
            close_connection()

            return jsonify({"msg": f"added name {name_val} with score {score_val}"})
        return jsonify({"msg": "no score posted, missing data or score 0"})
    return jsonify({"error": "invalid request type"})


