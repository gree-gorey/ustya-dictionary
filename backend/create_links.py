# -*- coding:utf-8 -*-


__author__ = 'gree-gorey'


total_number_of_slices = 15


def create_links(es):
    links = list()

    for i in xrange(0, total_number_of_slices):
        res = es.search(index="temp_dict", body={"query": {"match": {"class": str(i)}},
                                                 "sort": [{"field_for_sorting": {"order": "asc"}}],
                                                 "size": 10000})

        print i, len(res['hits']['hits'])

        link = res['hits']['hits'][0]['_source']['field_for_sorting'][:3:].capitalize() + u'—' + res['hits']['hits'][-1]['_source']['field_for_sorting'][:3:].capitalize()
        links.append(link)

    return links


def get_entries_by_class(es, slice_number):
    res = es.search(index="temp_dict", body={"query": {"match": {"class": str(slice_number)}},
                                             "sort": [{"field_for_sorting": {"order": "asc"}}],
                                             "size": 10000})
    # return [hit["_source"] for hit in res['hits']['hits']]
    return res['hits']['hits']


def main():
    pass


if __name__ == '__main__':
    main()