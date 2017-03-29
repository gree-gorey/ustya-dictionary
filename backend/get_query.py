# -*- coding:utf-8 -*-

__author__ = 'gree-gorey'


def get_query(field, string):
    result = {
        "query": {
            "nested": {
                "path": "senses.elements",
                "score_mode": "avg",
                "query": {
                    "bool": {
                        "must": [
                            {
                                "match": {"senses.elements.tag": field}
                            },
                            {
                                "match": {"senses.elements.content": string}
                            }
                        ]
                    }
                }
            }
        },
        "sort": [{"header.forms.normalized_content": {"order": "asc"}}],
        "size": 500
    }

    return result


def get_query_example(field, string):
    result = {
        "query": {
            "nested": {
                "path": "senses.elements",
                "score_mode": "avg",
                "query": {
                    "bool": {
                        "must": [
                            {
                                "match": {"senses.elements.tag": field}
                            },
                            {
                                "match": {"senses.elements.normalized_content": string}
                            }
                        ]
                    }
                }
            }
        },
        "sort": [{"header.forms.normalized_content": {"order": "asc"}}],
        "size": 500
    }

    return result