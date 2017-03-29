# -*- coding:utf-8 -*-


borders = [
    u'а',
    u'бас',
    u'бла',
    u'бру',
    u'я'
]


def norm(string):
    return string.lower().replace(u'́', u'').replace(u'ў', u'у')


def normalize(entry):
    tags_to_norm = [
        'example',
        'form',
        'ref',
        'quote'
    ]
    for form in entry['header']['forms']:
        form['normalized_content'] = norm(form['content'])
    for sense in entry['senses']:
        for element in sense['elements']:
            if element['tag'] in tags_to_norm:
                element['normalized_content'] = norm(element['content'])

    entry['field_for_sorting'] = entry['header']['forms'][0]['normalized_content'].replace(u' ', u'').replace(u' ', u'').replace(u',', u'')

    return entry


def add_class(entry):
    triple = entry['field_for_sorting'][:3:]
    for i in xrange(0, len(borders) - 1):
        if borders[i] <= triple < borders[i + 1]:
            entry['class'] = i
        if triple >= borders[-1]:
            entry['class'] = len(borders) - 2

    return entry
