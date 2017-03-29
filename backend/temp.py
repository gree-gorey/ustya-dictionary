# -*- coding:utf-8 -*-

import os
import elasticsearch
import json
import time
import codecs


__author__ = 'gree-gorey'


es = elasticsearch.Elasticsearch()


def entries(path):
    # i = 0
    for root, dirs, files in os.walk(path):
        for filename in files:
            # if i == 10:
            #     break
            open_name = os.path.join(root, filename)
            with codecs.open(open_name, u'r', u'utf-8') as f:
                result = json.load(f)
            # index = int(filename.replace(u'.json', u''))
            # yield result, index
            # i += 1
            yield result
            # return result, index


def run():
    t1 = time.time()
    for entry in entries('./output'):
        es.index(index='temp_dict', doc_type='entry', body=entry)

    t2 = time.time()
    print t2 - t1


def delete_index():
    es.indices.delete(index='temp_dict', ignore=[400, 404])


def create_index():
    es.indices.create(index='temp_dict', ignore=400)


def set_mapping():
    mapping = json.load(codecs.open(u'map.json', u'r', u'utf-8'))
    es.indices.put_mapping(doc_type='entry', body=mapping, index='temp_dict')

delete_index()
create_index()
set_mapping()
run()


# def beep():
#     import os
#     os.system('( speaker-test -t sine -f 1000 )& pid=$! ; sleep 0.5s ; kill -9 $pid')

# body = {
#   "header": {
#     "forms": [],
#     "style": [],
#     "place": []
#   },
#   "senses": [
#     {
#       "elements": [],
#       "n": "1"
#     }
#   ]
# }

# body = {"foo": "bar"}

# res = es.index(index='temp_dict', doc_type='entry', id=1, body=body)
# print res["created"]
# print res["_id"]
# print res

# res = es.scroll()
# print res

# res = es.get(index="temp_dict", doc_type='entry', id=551)
# print(res)

#
# for entry in entries[u'entries']:
#     es.index(index='temp_dict', doc_type='entry', body=entry)

# es.index(index='temp_dict', doc_type='entry', id=1, body=new_entry)

# res = es.get(index="temp_dict", doc_type='entry', id=1)
# print(res['_source'])

# res = es.get(index="temp_dict", doc_type='counter', id=0)['_source']['id']
# print type(res)
# es.delete(index="temp_dict", doc_type="entry", id='AVTYGGA6dZgPWiCQjqHy')

# res = es.search(index="temp_dict", body={
#     "query": {
#         "nested" : {
#             "path" : "senses.elements",
#             "score_mode" : "avg",
#             "query" : {
#                 "bool" : {
#                     "should" : [
#                         {
#                             "match" : {"senses.elements.tag" : "def"}
#                         },
#                         {
#                             "match" : {"senses.elements.content" : "но"}
#                         }
#                     ]
#                 }
#             }
#         }
#     }
# })

"""

def slices():
    res = es.search(index="temp_dict", body={"query": {"match_all": {}},
                                             "sort": [{"field_for_sorting": {"order": "asc"}}],
                                             "size": 10000})

    sources = [hit["_source"] for hit in res['hits']['hits']]
    n_of_slices = 15
    length = len(sources)
    size_of_slice = int(float(length) / n_of_slices)
    left_border = 0

    for i in xrange(0, n_of_slices):
        if left_border + size_of_slice < length:
            right_border = left_border + size_of_slice
        else:
            right_border = length - 1
        try:
            print sources[left_border]['field_for_sorting'][:3:], sources[right_border]['field_for_sorting'][:3:]
        except:
            print sources[right_border]
        left_border += size_of_slice


slices()

"""

# res = es.search(index="temp_dict", body={"query": {"match": {"class": "1"}},
#                                          "sort": [{"field_for_sorting": {"order": "asc"}}],
#                                          "size": 10000})
#
# print len(res['hits']['hits'])
# print res['hits']['hits'][0]['_source']['field_for_sorting'][:3:].capitalize()



# res = es.search(index="temp_dict", body={"query": {"multi_match": {"query": u'арево', "fields": ["*forms.normalized_content"]}}})
#
# print res['hits']['hits'][0]['_source']['header']['forms'][0]['normalized_content']
#
#
#
# # res = es.search(index="temp_dict", body={"query": { "bool": {"should": {"constant_score" : {"filter" : {"missing" : { "field" : "header.forms" }}}}}}})
# # res = es.search(index="temp_dict", body={"query": { "multi_match": { "query": u'my', "fields": [ "*" ] }}})
# for hit in res['hits']['hits']:
#     print hit["_id"]
#     # es.delete(index="temp_dict",doc_type="entry", id=hit["_id"])
#     # print hit["_id"]
#     # try:
#     #     print hit["_source"]['header']['forms'][0]['content']
#     # except:
#     #     print hit["_id"]
#     print hit["_source"]['header']['forms'][0]['content']
#     print hit["_source"]['senses']
#     break


# beep()
