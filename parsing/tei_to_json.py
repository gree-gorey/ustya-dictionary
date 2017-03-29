# -*- coding:utf-8 -*-

import json
import codecs
from lxml import etree


__author__ = 'gree-gorey'


borders = [
    u'а',
    u'вал',
    u'выд',
    u'див',
    u'заг',
    u'ивк',
    u'кор',
    u'маг',
    u'нах',
    u'ост',
    u'под',
    u'пря',
    u'ска',
    u'тве',
    u'хин',
    u'ё'
]


content = u'output.xml'

tei = etree.parse(content).getroot()

body = tei[1][1]

entries = 0

for entry in body:
    entries += 1
    json_entry = {u'header': {u'forms': [], u'style': [], u'place': []}, u'senses': []}
    for element in entry:
        if element.tag == u'form':
            json_element = {}
            json_element = {u'type': element.get(u'type'), u'content': element[0].text,
                            u'place': [], u'style': [], u'ana': u'',
                            u'normalized_content': element[0].text.lower().replace(u'́', u'').replace(u'ў', u'у').replace(u'ё', u'е')}
            if element.get(u'type') == u'inflected':
                json_element[u'ana'] = element.get(u'ana')
            if len(element) > 1:
                for form_element in element:
                    if form_element.tag == u'usg':
                        json_element[u'style'].append(form_element.text)
                    elif form_element.tag == u'placeName':
                        json_element[u'place'].append(form_element[0].text)
            json_entry[u'header'][u'forms'].append(json_element)

        elif element.tag == u'usg':
            json_entry[u'header'][u'style'].append(element.text)
        elif element.tag == u'placeName':
            json_entry[u'header'][u'style'].append(element[0].text)

        elif element.tag == u'sense':
            json_element = {u'n': element.get(u'n'), u'elements': []}
            for sense_element in element:
                if sense_element.tag == u'def':
                    json_sense_element = {}
                    json_sense_element = {u'tag': u'def', u'content': sense_element.text}
                    json_element[u'elements'].append(json_sense_element)
                elif sense_element.tag == u'ref':
                    json_sense_element = {}
                    json_sense_element = {u'tag': u'ref', u'ana': sense_element.get(u'ana'),
                                          u'content': sense_element[0][0].text, u'style': [], u'place': [],
                                          u'normalized_content': sense_element[0][0].text.lower().replace(u'́', u'').replace(u'ў', u'у').replace(u'ё', u'е')}
                    if len(sense_element[0]) > 1:
                        for form_element in sense_element[0]:
                            if form_element.tag == u'usg':
                                json_sense_element[u'style'].append(form_element.text)
                            elif form_element.tag == u'placeName':
                                json_sense_element[u'place'].append(form_element[0].text)
                    json_element[u'elements'].append(json_sense_element)
                elif sense_element.tag == u'cit':
                    if sense_element[0].text:
                        json_sense_element = {}

                        if sense_element[0].text[0].istitle():
                            json_sense_element = {u'tag': u'example', u'content': sense_element[0].text,
                                                  u'normalized_content': sense_element[0].text.lower().replace(u'́', u'').replace(u'ў', u'у').replace(u'ё', u'е'),
                                                  u'translation': u'', u'bibl': u''}

                            if len(sense_element) > 1:
                                for example_sense_element in sense_element:
                                    if example_sense_element.get(u'type') == u'translation':
                                        json_sense_element[u'translation'] = example_sense_element[0].text
                                    elif example_sense_element.tag == u'bibl':
                                        json_sense_element[u'bibl'] = example_sense_element.text

                        else:
                            json_sense_element = {u'tag': u'quote', u'content': sense_element[0].text,
                                                  u'normalized_content': sense_element[0].text.lower().replace(u'́', u'').replace(u'ў', u'у').replace(u'ё', u'е')}
                        json_element[u'elements'].append(json_sense_element)
                elif sense_element.tag == u'usg':
                    json_sense_element = {}
                    json_sense_element = {u'tag': u'style', u'content': sense_element.text}
                    json_element[u'elements'].append(json_sense_element)

                elif sense_element.tag == u'form':
                    json_sense_element = {}
                    json_sense_element = {u'type': sense_element.get(u'type'), u'content': sense_element[0].text,
                                          u'place': [], u'style': [], u'ana': u'', u'tag': u'form',
                                          u'normalized_content': sense_element[0].text.lower().replace(u'́', u'').replace(u'ў', u'у').replace(u'ё', u'е')}
                    if sense_element.get(u'type') == u'inflected':
                        json_sense_element[u'ana'] = sense_element.get(u'ana')
                    if len(sense_element) > 1:
                        for form_element in sense_element:
                            if form_element.tag == u'usg':
                                json_sense_element[u'style'].append(form_element.text)
                            elif form_element.tag == u'placeName':
                                json_sense_element[u'place'].append(form_element[0].text)
                    json_element[u'elements'].append(json_sense_element)

                elif sense_element.tag == u'gramGrp':
                    json_sense_element = {}
                    json_sense_element = {u'tag': u'pos', u'content': sense_element[0].text}
                    json_element[u'elements'].append(json_sense_element)

                elif sense_element.tag == u'placeName':
                    json_sense_element = {}
                    json_sense_element = {u'tag': u'place', u'content': sense_element[0].text}
                    json_element[u'elements'].append(json_sense_element)

                else:
                    json_sense_element = {}
                    json_sense_element = {u'tag': sense_element.tag, u'content': sense_element.text}
                    json_element[u'elements'].append(json_sense_element)

            json_entry[u'senses'].append(json_element)

    if json_entry[u'header'][u'forms']:
        json_entry['field_for_sorting'] = json_entry[u'header'][u'forms'][0]['normalized_content'].replace(u' ', u'').replace(u' ', u'').replace(u',', u'').replace(u'ё', u'е')
        triple = json_entry['field_for_sorting'][:3:]
    else:
        json_entry['field_for_sorting'] = u''
        triple = json_entry['field_for_sorting'][:3:]

    for i in xrange(0, len(borders) - 1):
        if borders[i] <= triple < borders[i + 1]:
            json_entry['class'] = i
        if triple >= borders[-1]:
            json_entry['class'] = len(borders) - 2

    json_entry['type'] = entry.get('type')
    json_entry['header']['pos'] = ''

    w = codecs.open(u'../backend/output/' + str(entries) + u'.json', u'w', u'utf-8')
    json.dump(json_entry, w, ensure_ascii=False, indent=2)
    w.close()

print entries


def beep():
    import os
    os.system('( speaker-test -t sine -f 1000 )& pid=$! ; sleep 0.3s ; kill -9 $pid')

beep()
