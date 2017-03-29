# -*- coding:utf-8 -*-

import time
import flask
import bcrypt
import flask_login
import elasticsearch
from normalize import normalize, add_class
from export_json import create_zip_with_json
from export_tei import create_tei_xml, create_zip
from get_query import get_query, get_query_example
from create_links import create_links, get_entries_by_class

__author__ = 'gree-gorey'

# Initialize Elasticsearch
es = elasticsearch.Elasticsearch()

# Initialize the Flask application
app = flask.Flask(__name__)

# app.config['APPLICATION_ROOT'] = '/dictionary'

login_manager = flask_login.LoginManager()
login_manager.init_app(app)
app.secret_key = 'rewyuiop[lkjhgfdssdfghjkoiuytr'


res = es.search(index="users", body={"query": {"match_all": {}}})
users = [hit["_source"]["login"] for hit in res['hits']['hits']]


class User(flask_login.UserMixin):
    pass


@login_manager.user_loader
def user_loader(login):
    if login not in users:
        return

    user = User()
    user.id = login
    return user

# @login_manager.request_loader
# def request_loader(request):
#     email = request.form.get('email')
#     if email not in users:
#         return
#
#     user = User()
#     user.id = email
#
#     # DO NOT ever store passwords in plaintext and always compare password
#     # hashes using constant-time comparison!
#     user.is_authenticated = request.form['pw'] == users[email]['pw']
#
#     return user


@app.route('/login', methods=['GET', 'POST'])
def login():
    if flask.request.method == 'GET':
        return flask.render_template('login.html')

    login = flask.request.form['login']
    password = flask.request.form['pw'].encode('utf-8')
    res = es.search(index="users", body={"query": {"match": {"login": login}}, "size": 1})

    if res['hits']['hits']:
        hashed = res['hits']['hits'][0]['_source']['password']

        if hashed == bcrypt.hashpw(password, str(hashed)):
            user = User()
            user.id = login
            flask_login.login_user(user)
            return flask.redirect(flask.url_for('search'))
        else:
            return 'Bad login'

    else:
        return 'Bad login'


@app.route('/logout')
def logout():
    flask_login.logout_user()
    return flask.redirect(flask.url_for('index'))


@login_manager.unauthorized_handler
def unauthorized_handler():
    return flask.redirect(flask.url_for('login'))


@app.route('/')
def index():
    return flask.render_template('index.html')


@app.route('/search')
def search():
    return flask.render_template('search.html')


@app.route('/download')
def download():
    return flask.render_template('download.html')


@app.route('/preview')
def preview():
    return flask.render_template('preview.html')


@app.route('/explore')
def explore():
    return flask.render_template('explore.html')


@app.route('/edit')
@flask_login.login_required
def edit():
    return flask.render_template('edit.html')


@app.route('/contacts')
def contacts():
    return flask.render_template('contacts.html')


@app.route('/_query')
def query():
    query = flask.request.args.get('query', 0, type=unicode)
    parameter = flask.request.args.get('parameter', 0, type=unicode)
    # WORKS
    if parameter == 'all':
        res = es.search(index="temp_dict", body={"query": {"match": {"_all": query}},
                        "sort": [{"field_for_sorting": {"order": "asc"}}],
                        "size": 500})
    # WORKS
    elif parameter == 'header':
        res = es.search(index="temp_dict", body={"query": {"match": {"header.forms.normalized_content": query}},
                        "sort": [{"field_for_sorting": {"order": "asc"}}],
                        "size": 500})
    # WORKS
    elif parameter == 'form':
        res = es.search(index="temp_dict",
                        body={"query": {"multi_match": {"query": query, "fields": ["header.forms.normalized_content"]}},
                              "sort": [{"field_for_sorting": {"order": "asc"}}],
                              "size": 500})
        res_form_from_senses = es.search(index="temp_dict", body=get_query_example('form', query))
        res_ref_from_senses = es.search(index="temp_dict", body=get_query_example('ref', query))
        res['hits']['hits'] += res_form_from_senses['hits']['hits']
        res['hits']['hits'] += res_ref_from_senses['hits']['hits']
    # WORKS
    elif parameter == 'def':
        res = es.search(index="temp_dict", body=get_query('def', query))
    # WORKS
    elif parameter == 'example':
        res = es.search(index="temp_dict", body=get_query_example('example', query))
    # WORKS
    elif parameter == 'place':
        res = es.search(index="temp_dict",
                        body={"query": {"multi_match": {"query": query, "fields": ["header.forms.place",
                                                                                   "header.place",
                                                                                   "senses.elements.place"]}},
                              "sort": [{"field_for_sorting": {"order": "asc"}}],
                              "size": 500})
        res_place_from_senses = es.search(index="temp_dict", body=get_query('place', query))
        res['hits']['hits'] += res_place_from_senses['hits']['hits']
    # WORKS
    elif parameter == 'style':
        res = es.search(index="temp_dict",
                        body={"query": {"multi_match": {"query": query, "fields": ["header.forms.style",
                                                                                   "header.style",
                                                                                   "senses.elements.style"]}},
                              "sort": [{"field_for_sorting": {"order": "asc"}}],
                              "size": 500})
        res_style_from_senses = es.search(index="temp_dict", body=get_query('style', query))
        res['hits']['hits'] += res_style_from_senses['hits']['hits']
    else:
        res = {'hits': {}}
        res['hits']['hits'] = None

    if res['hits']['hits']:
        result = [True, res['hits']['hits']]
    else:
        result = [False, None]
    return flask.jsonify(result=result)


@app.route('/_get_by_id')
def get_by_id():
    index = flask.request.args.get('index', 0, type=unicode)
    # print index
    result = es.get(index="temp_dict", doc_type='entry', id=index)
    return flask.jsonify(result=result)


@app.route('/_get_letter_list')
def get_letter_list():
    slice_number = flask.request.args.get('slice', 0, type=int)
    links = create_links(es)
    entries = get_entries_by_class(es, slice_number)
    result = {'links': links, 'entries': entries}
    return flask.jsonify(result=result)


@app.route('/_save', methods=['GET', 'POST'])
def save():
    json_from_client = flask.request.json
    entry = normalize(json_from_client['entry'])
    entry = add_class(entry)

    if json_from_client['edit'] == 'edit':
        index = json_from_client['index']
        try:
            res = es.index(index='temp_dict', doc_type='entry', id=index, body=entry)
            result = {'feedback': 'success', 'id': res['_id']}
        except:
            result = {'feedback': 'failure'}
    else:
        try:
            res = es.index(index='temp_dict', doc_type='entry', body=entry)
            result = {'feedback': 'success', 'id': res['_id']}
        except:
            result = {'feedback': 'failure'}

    return flask.jsonify(result=result)


@app.route('/_delete', methods=['GET', 'POST'])
def delete():
    json_from_client = flask.request.json
    index = json_from_client['index']
    try:
        es.delete(index="temp_dict", doc_type="entry", id=index)
        result = {'feedback': 'success'}
    except:
        result = {'feedback': 'failure'}
    return flask.jsonify(result=result)


@app.route('/_export_tei', methods=['GET', 'POST'])
def export_tei():
    res = es.search(index="temp_dict", body={"query": {"match_all": {}},
                    "sort": [{"field_for_sorting": {"order": "asc"}}],
                    "size": 10000})

    all_entries = [hit["_source"] for hit in res['hits']['hits']]

    try:
        xml_doc = create_tei_xml(all_entries)
        create_zip(xml_doc)
        result = "success"
    except:
        result = "failure"

    return flask.jsonify(result=result)


@app.route('/_export_json', methods=['GET', 'POST'])
def _export_json():
    res = es.search(index="temp_dict", body={"query": {"match_all": {}},
                    "sort": [{"field_for_sorting": {"order": "asc"}}],
                    "size": 10000})

    all_entries = [hit["_source"] for hit in res['hits']['hits']]

    try:
        create_zip_with_json(all_entries)
        result = "success"
    except:
        result = "failure"

    return flask.jsonify(result=result)


@app.route('/_user_info', methods=['GET', 'POST'])
def user_info():
    user = dict()
    user['logged'] = flask_login.current_user.is_authenticated
    if user['logged']:
        user['name'] = flask_login.current_user.id
    return flask.jsonify(result=user)


if __name__ == '__main__':
    app.run(
        # host="0.0.0.0",
        # port=int("80"),
        # debug=True
    )
