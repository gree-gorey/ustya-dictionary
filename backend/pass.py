# -*- coding:utf-8 -*-

import bcrypt
import elasticsearch


__author__ = 'gree-gorey'


es = elasticsearch.Elasticsearch()


def create_index():
    es.indices.create(index='users', ignore=400)


def delete_index():
    es.indices.delete(index='users', ignore=[400, 404])


def sign_up_user():
    login = raw_input('login: ')
    password = raw_input('password: ')

    hashed = bcrypt.hashpw(password, bcrypt.gensalt())

    body = {
        'login': login,
        'password': hashed
    }

    es.index(index='users', doc_type='user', body=body)


delete_index()
create_index()
sign_up_user()
