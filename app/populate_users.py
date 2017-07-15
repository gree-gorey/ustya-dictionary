import bcrypt
import configparser


def create_index(es):
    es.indices.create(index='users', ignore=400)


def delete_index(es):
    es.indices.delete(index='users', ignore=[400, 404])


def sign_up_user(es):
    config = configparser.ConfigParser()
    config.read('app.conf')
    login = config['user']['login']
    password = config['user']['password']

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    body = {
        'login': login,
        'password': hashed.decode()
    }

    es.index(index='users', doc_type='user', body=body)


def populate_users(es):
    delete_index(es)
    create_index(es)
    sign_up_user(es)
