import os
import json
import codecs


def entries(path):
    for root, dirs, files in os.walk(path):
        for filename in files:
            open_name = os.path.join(root, filename)
            with codecs.open(open_name, u'r', u'utf-8') as f:
                result = json.load(f)
            yield result


def run(es):
    for entry in entries('/data'):
        es.index(index='temp_dict', doc_type='entry', body=entry)


def delete_index(es):
    es.indices.delete(index='temp_dict', ignore=[400, 404])


def create_index(es):
    es.indices.create(index='temp_dict', ignore=400)


def set_mapping(es):
    mapping = json.load(codecs.open(u'/map/map.json', u'r', u'utf-8'))
    es.indices.put_mapping(doc_type='entry', body=mapping, index='temp_dict')


def populate(es):
    delete_index(es)
    create_index(es)
    set_mapping(es)
    run(es)
