# -*- coding:utf-8 -*-

import re
import time
import codecs
from lxml import etree


__author__ = 'gree-gorey'


class P:
    def __init__(self):
        self.items = []
        self.lemmata = []
        self.localities = []
        self.examples = []
        self.dashes = []
        self.inflections = []
        self.references = []
        self.italics = []
        self.labels = []
        self.meanings = []


class Dictionary:
    def __init__(self, content):
        self.xml_dict = etree.Element(u'TEI')
        self.xml_doc = etree.ElementTree(self.xml_dict)
        self.tree = etree.parse(content)
        self.entries = []
        self.additional_p = []
        self.namespaces = {u'text': u'urn:oasis:names:tc:opendocument:xmlns:text:1.0',
                           u'office': u'urn:oasis:names:tc:opendocument:xmlns:office:1.0',
                           u'style': u'urn:oasis:names:tc:opendocument:xmlns:style:1.0',
                           u'fo': u'urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0'}

    def collect_entries(self):
        all_p = self.tree.xpath(u'//text:p', namespaces=self.namespaces)

        print len(all_p)

        for p in all_p:
            dashes = p.xpath(u'./text:span[@text:style-name = /office:document-content/office:automatic-styles/'
                             u'style:style[style:text-properties/@fo:color="#6666ff"]/@style:name]',
                             namespaces=self.namespaces)

            if dashes:
                entry = Entry()

                entry.type = 'word'

                siblings = dashes[0].xpath(u'(preceding-sibling::* | following-sibling::*)',
                                           namespaces=self.namespaces)

                preceding_siblings = dashes[0].xpath(u'preceding-sibling::*',
                                                     namespaces=self.namespaces)

                following_siblings = dashes[0].xpath(u'following-sibling::*',
                                                     namespaces=self.namespaces)

                lemmata = []

                for sibling in siblings:
                    lemmata += sibling.xpath(u'descendant-or-self::text:span[@text:style-name = '
                                             u'/office:document-content/'
                                             u'office:automatic-styles/style:style[style:text-properties/'
                                             u'@fo:color="#ff3333"]/@style:name]',
                                             namespaces=self.namespaces)

                localities = []

                for sibling in siblings:
                    localities += sibling.xpath(u'descendant-or-self::text:span[@text:style-name = '
                                                u'/office:document-content/'
                                                u'office:automatic-styles/style:style[style:text-properties/'
                                                u'@fo:color="#9900ff"]/@style:name]',
                                                namespaces=self.namespaces)

                labels = []

                for sibling in siblings:
                    labels += sibling.xpath(u'descendant-or-self::text:span[@text:style-name = '
                                            u'/office:document-content/'
                                            u'office:automatic-styles/style:style[style:text-properties/'
                                            u'@fo:color="#00ccff"]/@style:name]',
                                            namespaces=self.namespaces)

                examples = []

                for sibling in siblings:
                    examples += sibling.xpath(u'descendant-or-self::text:span[@text:style-name = '
                                              u'/office:document-content/'
                                              u'office:automatic-styles/style:style[style:text-properties/'
                                              u'@fo:color="#ff00cc"]/@style:name]',
                                              namespaces=self.namespaces)

                inflections = []

                for sibling in siblings:
                    inflections += sibling.xpath(u'descendant-or-self::text:span[@text:style-name = '
                                                 u'/office:document-content/'
                                                 u'office:automatic-styles/style:style[style:text-properties/'
                                                 u'@fo:color="#cc9900"]/@style:name]',
                                                 namespaces=self.namespaces)

                references = []

                for sibling in siblings:
                    references += sibling.xpath(u'descendant-or-self::text:span[@text:style-name = '
                                                u'/office:document-content/'
                                                u'office:automatic-styles/style:style[style:text-properties/'
                                                u'@fo:color="#ffcc00"]/@style:name]',
                                                namespaces=self.namespaces)

                italics = []

                for sibling in siblings:
                    italics += sibling.xpath(u'descendant-or-self::text:span[@text:style-name = '
                                             u'/office:document-content/'
                                             u'office:automatic-styles/style:style[style:text-properties/'
                                             u'@fo:font-style="italic"]/@style:name]',
                                             namespaces=self.namespaces)

                qs = []

                for sibling in siblings:
                    qs += sibling.xpath(u'descendant-or-self::text:span[@text:style-name = '
                                        u'/office:document-content/'
                                        u'office:automatic-styles/style:style[style:text-properties/'
                                        u'@fo:color="#00cc00"]/@style:name]',
                                        namespaces=self.namespaces)

                # everything before dash is head elements
                head = []

                for sibling in preceding_siblings:
                    head += sibling.xpath(u'descendant-or-self::text:span[text()]',
                                          namespaces=self.namespaces)

                if head:
                    entry.head = Head()

                    for item in head:
                        element = Element()
                        entry.head.elements.append(element)

                        element.text = item.text
                        if item in lemmata:
                            element.tag = u'lemma'
                        elif item in localities:
                            element.tag = u'locality'
                        elif item in labels:
                            element.tag = u'word-label'
                        elif item in inflections:
                            element.tag = u'inflection'
                        elif item in references:
                            element.tag = u'reference'
                        elif item in italics:
                            element.tag = u'italic'
                        else:
                            element.tag = u'def'

                # everything after dash is content elements
                content = []

                for sibling in following_siblings:
                    content += sibling.xpath(u'descendant-or-self::text:span[text()]',
                                             namespaces=self.namespaces)

                meanings = []

                for sibling in following_siblings:
                    meanings += sibling.xpath(u'descendant-or-self::text:span[@text:style-name = '
                                              u'/office:document-content/'
                                              u'office:automatic-styles/style:style[style:text-properties/'
                                              u'@fo:color="#ff6600"]/@style:name]',
                                              namespaces=self.namespaces)

                if content:
                    entry.content = Content()

                    if content[0] in meanings:
                        entry.content.several = True

                    if not entry.content.several:
                        entry.content.meaning_on()

                    for item in content:
                        item.set('in_q', 'not_in_q')

                    for i, item in enumerate(content):
                        if item in meanings and entry.content.several:
                            entry.content.meaning_on()
                        else:
                            if entry.content.meanings:
                                element = Element()

                                if item in qs:
                                    new_p = P()
                                    for xml_element in content[i+1::]:
                                        if xml_element in qs or xml_element in meanings:
                                            break
                                        xml_element.set('in_q', 'in_q')
                                        new_p.items.append(xml_element)
                                        new_p.lemmata += lemmata
                                        new_p.localities += localities
                                        new_p.labels += labels
                                        new_p.examples += examples
                                        new_p.dashes += dashes
                                        new_p.inflections += inflections
                                        new_p.references += references
                                        new_p.italics += italics
                                        new_p.meanings += meanings

                                    ref = etree.Element('ref')
                                    ref.text = u'См.'
                                    new_p.references.append(ref)
                                    new_p.items.append(ref)

                                    lemma = etree.Element('lemma')
                                    lemma.text = new_p.lemmata[0].text
                                    new_p.lemmata.append(lemma)
                                    new_p.items.append(lemma)

                                    self.additional_p.append(new_p)

                                else:
                                    if item.get('in_q') != 'in_q':

                                        entry.content.meanings[-1].elements.append(element)

                                        element.text = item.text
                                        if item in lemmata:
                                            element.tag = u'lemma'
                                        elif item in localities:
                                            element.tag = u'locality'
                                        elif item in labels:
                                            element.tag = u'word-label'
                                        elif item in examples:
                                            element.tag = u'example'
                                        elif item in dashes:
                                            element.tag = u'dash'
                                        elif item in inflections:
                                            element.tag = u'inflection'
                                        elif item in references:
                                            element.tag = u'reference'
                                        elif item in italics:
                                            element.tag = u'italic'
                                        else:
                                            element.tag = u'def'

                self.entries.append(entry)

    def collect_additional_entries(self):
        print len(self.additional_p)

        for p in self.additional_p:
            dashes = p.dashes

            dash = None

            for item in p.items:
                if item in dashes:
                    dash = item
                    break

            if dash is not None:
                entry = Entry()

                entry.type = 'idiom'

                preceding_siblings = dash.xpath(u'preceding-sibling::*',
                                                namespaces=self.namespaces)

                following_siblings = dash.xpath(u'following-sibling::*',
                                                namespaces=self.namespaces)

                lemmata = p.lemmata
                localities = p.localities
                labels = p.labels
                examples = p.examples
                inflections = p.inflections
                references = p.references
                italics = p.italics

                # everything before dash is head elements
                head = []

                for sibling in preceding_siblings:
                    head += sibling.xpath(u'descendant-or-self::text:span[text()]',
                                          namespaces=self.namespaces)

                if head:
                    entry.head = Head()

                    for item in head:
                        if item in p.items:
                            element = Element()
                            entry.head.elements.append(element)

                            element.text = item.text
                            if item in lemmata:
                                element.tag = u'lemma'
                            elif item in localities:
                                element.tag = u'locality'
                            elif item in labels:
                                element.tag = u'word-label'
                            elif item in inflections:
                                element.tag = u'inflection'
                            elif item in references:
                                element.tag = u'reference'
                            elif item in italics:
                                element.tag = u'italic'
                            else:
                                element.tag = u'def'

                # everything after dash is content elements
                content = []

                for sibling in following_siblings:
                    content += sibling.xpath(u'descendant-or-self::text:span[text()]',
                                             namespaces=self.namespaces)

                content += p.items[-2::]

                meanings = p.meanings

                if content:
                    entry.content = Content()

                    if content[0] in p.items and content[0] in meanings:
                        entry.content.several = True

                    if not entry.content.several:
                        entry.content.meaning_on()

                    for i, item in enumerate(content):
                        if item in p.items:
                            if item in meanings and entry.content.several:
                                entry.content.meaning_on()
                            else:
                                if entry.content.meanings:
                                    element = Element()

                                    entry.content.meanings[-1].elements.append(element)

                                    element.text = item.text
                                    if item in lemmata:
                                        element.tag = u'lemma'
                                    elif item in localities:
                                        element.tag = u'locality'
                                    elif item in labels:
                                        element.tag = u'word-label'
                                    elif item in examples:
                                        element.tag = u'example'
                                    elif item in dashes:
                                        element.tag = u'dash'
                                    elif item in inflections:
                                        element.tag = u'inflection'
                                    elif item in references:
                                        element.tag = u'reference'
                                    elif item in italics:
                                        element.tag = u'italic'
                                    else:
                                        element.tag = u'def'

                self.entries.append(entry)

    def create_tei_xml(self):
        xml_teiHeader = etree.Element(u'teiHeader')
        self.xml_dict.append(xml_teiHeader)

        xml_text = etree.Element(u'text')

        xml_front = etree.Element(u'front')
        xml_text.append(xml_front)

        xml_body = etree.Element(u'body')

        for entry in self.entries:
            xml_entry = etree.Element(u'entry')

            xml_entry.set('type', entry.type)

            lemmata = 0

            added = []

            for i, element in enumerate(entry.head.elements):
                if element.text:
                    if i not in added:
                        if element.tag == u'lemma':
                            added.append(i)
                            lemmata += 1
                            xml_form = etree.Element(u'form')
                            if lemmata < 2:
                                xml_form.set(u'type', u'lemma')
                            else:
                                xml_form.set(u'type', u'variant')
                            xml_orth = etree.Element(u'orth')
                            xml_orth.text = element.text
                            xml_form.append(xml_orth)
                            xml_entry.append(xml_form)

                        elif element.tag == u'locality':
                            added.append(i)
                            xml_placeName = etree.Element(u'placeName')
                            xml_settlement = etree.Element(u'settlement')
                            xml_settlement.set(u'type', u'village')
                            element.text = element.text.replace(u'(', u'')
                            element.text = element.text.replace(u')', u'')
                            xml_settlement.text = element.text
                            xml_placeName.append(xml_settlement)
                            try:
                                last_form = xml_entry.xpath(u'.//form')[-1]
                                last_form.append(xml_placeName)
                            except:
                                print(etree.tostring(xml_entry, pretty_print=True))

                            # xml_entry.append(xml_placeName)

                        elif element.tag == u'word-label':
                            added.append(i)
                            xml_usg = etree.Element(u'usg')
                            xml_usg.set(u'type', u'style')
                            xml_usg.text = element.text
                            xml_entry.append(xml_usg)

                        elif element.tag == u'inflection':
                            for j, following_element in enumerate(entry.head.elements[i+1::], start=i+1):
                                if u')' in following_element.text or following_element.tag == u'inflection':
                                    break
                                else:
                                    if following_element.tag == u'lemma':
                                        added.append(j)
                                        xml_form = etree.Element(u'form')
                                        xml_form.set(u'type', u'inflected')
                                        xml_form.set(u'ana', element.text)
                                        xml_orth = etree.Element(u'orth')
                                        xml_orth.text = following_element.text
                                        xml_form.append(xml_orth)
                                        xml_entry.append(xml_form)

            if entry.content:

                for i, meaning in enumerate(entry.content.meanings):
                    xml_sense = etree.Element(u'sense')
                    xml_sense.set(u'n', str(i+1))

                    # Это нужно будет для html
                    # if len(entry.content.meanings) > 1:
                    #     xml_meaning_number = etree.Element(u'n')
                    #     xml_meaning_number.text = str(i+1) + u'. '
                    #     xml_sense.append(xml_meaning_number)

                    added = []

                    for j, element in enumerate(meaning.elements):
                        if element.text:
                            if element.tag == u'example':
                                if j not in added:
                                    xml_cit = etree.Element(u'cit')
                                    xml_cit.set(u'type', u'example')
                                    xml_quote = etree.Element(u'quote')
                                    xml_quote.text = element.text
                                    xml_cit.append(xml_quote)

                                if j < len(meaning.elements) - 1:
                                    if meaning.elements[j+1].tag == u'dash':
                                        if j < len(meaning.elements) - 2:
                                            added.append(j+2)
                                            if meaning.elements[j+2].tag == u'example':
                                                xml_quote.text += u' – '
                                                xml_quote.text += meaning.elements[j+2].text
                                            else:
                                                xml_cit_translation = etree.Element(u'cit')
                                                xml_cit_translation.set(u'type', u'translation')
                                                xml_quote_translation = etree.Element(u'quote')
                                                xml_quote_translation.text = meaning.elements[j+2].text
                                                xml_cit_translation.append(xml_quote_translation)
                                                xml_cit.append(xml_cit_translation)

                                    elif meaning.elements[j+1].tag == u'def':
                                        if j > 0:
                                            if re.search(u'^\(.+\)\.?$', meaning.elements[j+1].text, flags=re.U):
                                            # if meaning.elements[j+1].text[0] == u'(':
                                                added.append(j+1)
                                                xml_cit_translation = etree.Element(u'cit')
                                                xml_cit_translation.set(u'type', u'translation')
                                                xml_quote_translation = etree.Element(u'quote')
                                                xml_quote_translation.text = meaning.elements[j+1].text
                                                xml_cit_translation.append(xml_quote_translation)
                                                xml_cit.append(xml_cit_translation)

                                    elif meaning.elements[j+1].tag == u'example':
                                        added.append(j+1)
                                        xml_quote.text += u' '
                                        xml_quote.text += meaning.elements[j+1].text

                                xml_sense.append(xml_cit)

                            elif element.tag == u'reference':
                                # print element.text
                                for k, following_element in enumerate(meaning.elements[j+1::], start=j+1):
                                    if u'.' in following_element.text:
                                        break
                                    else:
                                        if following_element.tag == u'lemma':
                                            # print element.text
                                            added.append(k)

                                            xml_ref = etree.Element(u'ref')
                                            xml_ref.set(u'ana', element.text)
                                            xml_form = etree.Element(u'form')
                                            xml_form.set(u'type', u'lemma')
                                            xml_orth = etree.Element(u'orth')
                                            xml_orth.text = following_element.text
                                            xml_form.append(xml_orth)
                                            xml_ref.append(xml_form)
                                            xml_sense.append(xml_ref)

                                        elif following_element.tag == u'def':
                                            if following_element.text == u'также':
                                                added.append(k)

                            elif element.tag == u'word-label':
                                if j not in added:
                                    xml_usg = etree.Element(u'usg')
                                    xml_usg.set(u'type', u'style')
                                    xml_usg.text = element.text
                                    xml_sense.append(xml_usg)

                            elif element.tag == u'inflection':
                                for k, following_element in enumerate(meaning.elements[j+1::], start=j+1):
                                    if u')' in following_element.text or following_element.tag == u'inflection':
                                        break
                                    else:
                                        if following_element.tag == u'lemma':
                                            added.append(k)
                                            xml_form = etree.Element(u'form')
                                            xml_form.set(u'type', u'inflected')
                                            xml_form.set(u'ana', element.text)
                                            xml_orth = etree.Element(u'orth')
                                            xml_orth.text = following_element.text
                                            xml_form.append(xml_orth)
                                            xml_sense.append(xml_form)

                            elif element.tag == u'italic' and j == 0:
                                if j not in added:
                                    xml_gramGrp = etree.Element(u'gramGrp')
                                    xml_pos = etree.Element(u'pos')
                                    xml_pos.text = element.text
                                    xml_gramGrp.append(xml_pos)
                                    xml_sense.append(xml_gramGrp)

                            elif element.tag == u'locality':
                                xml_placeName = etree.Element(u'placeName')
                                xml_settlement = etree.Element(u'settlement')
                                xml_settlement.set(u'type', u'village')
                                element.text = element.text.replace(u'(', u'')
                                element.text = element.text.replace(u')', u'')
                                xml_settlement.text = element.text
                                xml_placeName.append(xml_settlement)
                                try:
                                    last_form = xml_sense.xpath(u'.//form')[-1]
                                    last_form.append(xml_placeName)
                                except:
                                    xml_sense.append(xml_placeName)
                                    # print (etree.tostring(xml_sense, pretty_print=True))

                            elif element.tag == u'lemma':
                                if j not in added:
                                    xml_form = etree.Element(u'form')
                                    xml_form.set(u'type', u'lemma')
                                    xml_orth = etree.Element(u'orth')
                                    xml_orth.text = element.text
                                    xml_form.append(xml_orth)
                                    xml_sense.append(xml_form)

                            else:
                                if j not in added:
                                    # if len(element.text) == 1 and not element.text.isalpha():
                                    if not any(char.isalpha() for char in element.text):
                                        continue
                                    xml_element = etree.Element(element.tag)
                                    xml_element.text = element.text
                                    xml_sense.append(xml_element)

                    xml_entry.append(xml_sense)

            xml_body.append(xml_entry)

        for xml_entry in xml_body:
            for xml_sense in xml_entry.xpath(u'./sense'):
                to_remove = []
                examples = xml_sense.xpath(u'./cit')
                definitions = xml_sense.xpath(u'./def')
                # examples = xml_sense.xpath(u'./cit[@type = example]')
                # print len(examples)
                for i, element in enumerate(xml_sense):
                    if element in examples:
                        example_text = element.xpath(u'./quote')[0].text
                        if 0 < i < len(xml_sense) - 1:
                            if xml_sense[i+1].text:
                            # if xml_sense[i-1].text and xml_sense[i+1].text:
                                # if example_text[0].isupper() and xml_sense[i-1].text[-1] == u'«' and xml_sense[i+1].text[0] == u'»':
                                if example_text[0].isupper() and xml_sense[i+1].text[0] == u'»':

                                    xml_cit_bibl = etree.Element(u'bibl')
                                    if xml_sense[i-1].text:
                                        xml_sense[i-1].text = re.sub(u' ?«$', u'', xml_sense[i-1].text, flags=re.U)
                                    xml_sense[i+1].text = re.sub(u'^»\.? ', u'', xml_sense[i+1].text, flags=re.U)
                                    xml_cit_bibl.text = xml_sense[i+1].text
                                    element.append(xml_cit_bibl)

                                    to_remove.append(xml_sense[i+1])

                    elif element in definitions:
                        if element not in to_remove:
                            for j, following_element in enumerate(xml_sense[i+1::], start=i+1):
                                if following_element not in definitions:
                                    break
                                else:
                                    element.text += u' '
                                    element.text += following_element.text
                                    to_remove.append(following_element)

                for element_to_remove in to_remove:
                    xml_sense.remove(element_to_remove)

        xml_text.append(xml_body)

        xml_back = etree.Element(u'back')
        xml_text.append(xml_back)

        self.xml_dict.append(xml_text)

    def write_tei_xml(self):
        with codecs.open(u'output.xml', u'w') as w:
            self.xml_doc.write(w, encoding=u'utf-8')


class Entry:
    def __init__(self):
        self.head = None
        self.content = None


class Head:
    def __init__(self):
        self.elements = []


class Content:
    def __init__(self):
        self.several = False
        self.meanings = []

    def meaning_on(self):
        meaning = Meaning()
        self.meanings.append(meaning)


class Meaning:
    def __init__(self):
        self.elements = []


class Element:
    def __init__(self):
        self.text = u''
        self.tag = None
        self.in_q = False


def main():
    t1 = time.time()

    # создаем экземпляр словаря
    my_dictionary = Dictionary(u'content.xml')

    # собираем все вхождения
    my_dictionary.collect_entries()

    # собираем все Q вхождения
    my_dictionary.collect_additional_entries()

    # обходим все входы и превращаем в TEI XML
    my_dictionary.create_tei_xml()

    # записываем результат в файл
    my_dictionary.write_tei_xml()

    t2 = time.time()

    print t2 - t1

if __name__ == '__main__':
    main()
