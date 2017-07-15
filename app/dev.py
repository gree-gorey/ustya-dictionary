import flask
import os
import elasticsearch
import time
from populate import populate
from populate_users import populate_users


app = flask.Flask(__name__)

ep = os.environ['elastic.entrypoint']

es = elasticsearch.Elasticsearch(['http://elastic:changeme@{}'.format(ep)])


@app.route('/')
def index():
    return 'Hello world!\n'


@app.route('/populate')
def populate_ep():
    populate(es)
    return 'Done populate!\n'


@app.route('/populate_user')
def populate_users_ep():
    populate_users(es)
    return 'Done populate users!\n'


def main():
    app.run(
        host='0.0.0.0',
        port=80,
        debug=True
    )


if __name__ == '__main__':
    main()
