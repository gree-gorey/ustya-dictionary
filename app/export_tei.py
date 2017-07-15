import os
import json
import codecs
import zipfile
from lxml import etree


def entries(path):
    for root, dirs, files in os.walk(path):
        for filename in files:
            open_name = os.path.join(root, filename)
            with codecs.open(open_name, u'r', u'utf-8') as f:
                result = json.load(f)
            yield result


def create_tei_xml(index):
    xml_dict = etree.Element('TEI')
    xml_doc = etree.ElementTree(xml_dict)
    xml_teiHeader = etree.Element('teiHeader')
    xml_dict.append(xml_teiHeader)

    xml_text = etree.Element('text')

    xml_front = etree.Element('front')
    xml_text.append(xml_front)

    xml_body = etree.Element('body')

    for entry in index:
        xml_entry = etree.Element('entry')

        for form in entry['header']['forms']:
            xml_form = etree.Element('form')
            xml_form.set('type', form['type'])
            xml_orth = etree.Element('orth')
            xml_orth.text = form['content']
            xml_form.append(xml_orth)

            if form['type'] == 'inflected':
                xml_form.set('ana', form['ana'])

            for style in form['style']:
                xml_usg = etree.Element('usg')
                xml_usg.set('type', 'style')
                xml_usg.text = style
                xml_form.append(xml_usg)

            for place in form['place']:
                xml_placeName = etree.Element('placeName')
                xml_settlement = etree.Element('settlement')
                xml_settlement.set('type', 'village')
                xml_settlement.text = place
                xml_placeName.append(xml_settlement)
                xml_form.append(xml_placeName)

            xml_entry.append(xml_form)

        for style in entry['header']['style']:
            xml_usg = etree.Element('usg')
            xml_usg.set('type', 'style')
            xml_usg.text = style
            xml_entry.append(xml_usg)

        for place in entry['header']['place']:
            xml_placeName = etree.Element('placeName')
            xml_settlement = etree.Element('settlement')
            xml_settlement.set('type', 'village')
            xml_settlement.text = place
            xml_placeName.append(xml_settlement)
            xml_entry.append(xml_placeName)

        for sense in entry['senses']:
            xml_sense = etree.Element('sense')
            xml_sense.set('n', str(sense['n']))

            for element in sense['elements']:
                if element['tag'] == 'pos':
                    xml_gramGrp = etree.Element('gramGrp')
                    xml_pos = etree.Element('pos')
                    xml_pos.text = element['content']
                    xml_gramGrp.append(xml_pos)
                    xml_sense.append(xml_gramGrp)

                elif element['tag'] == 'def':
                    xml_def = etree.Element('def')
                    xml_def.text = element['content']
                    xml_sense.append(xml_def)

                elif element['tag'] == 'example':
                    xml_cit = etree.Element('cit')
                    xml_cit.set('type', 'example')
                    xml_quote = etree.Element('quote')
                    xml_quote.text = element['content']
                    xml_cit.append(xml_quote)
                    if element['translation']:
                        xml_cit_translation = etree.Element('cit')
                        xml_cit_translation.set('type', 'translation')
                        xml_quote_translation = etree.Element('quote')
                        xml_quote_translation.text = element['translation']
                        xml_cit_translation.append(xml_quote_translation)
                        xml_cit.append(xml_cit_translation)
                    if element['bibl']:
                        xml_bibl = etree.Element('bibl')
                        xml_bibl.text = element['bibl']
                        xml_cit.append(xml_bibl)
                    xml_sense.append(xml_cit)

                elif element['tag'] == 'form':
                    xml_form = etree.Element('form')
                    xml_form.set('type', element['type'])
                    xml_orth = etree.Element('orth')
                    xml_orth.text = element['content']
                    xml_form.append(xml_orth)

                    if element['type'] == 'inflected':
                        xml_form.set('ana', element['ana'])

                    for style in element['style']:
                        xml_usg = etree.Element('usg')
                        xml_usg.set('type', 'style')
                        xml_usg.text = style
                        xml_form.append(xml_usg)

                    for place in element['place']:
                        xml_placeName = etree.Element('placeName')
                        xml_settlement = etree.Element('settlement')
                        xml_settlement.set('type', 'village')
                        xml_settlement.text = place
                        xml_placeName.append(xml_settlement)
                        xml_form.append(xml_placeName)

                    xml_sense.append(xml_form)

                elif element['tag'] == 'ref':
                    xml_ref = etree.Element('ref')
                    xml_ref.set('ana', element['ana'])

                    xml_form = etree.Element('form')
                    xml_orth = etree.Element('orth')
                    xml_orth.text = element['content']
                    xml_form.append(xml_orth)

                    for style in element['style']:
                        xml_usg = etree.Element('usg')
                        xml_usg.set('type', 'style')
                        xml_usg.text = style
                        xml_form.append(xml_usg)

                    for place in element['place']:
                        xml_placeName = etree.Element('placeName')
                        xml_settlement = etree.Element('settlement')
                        xml_settlement.set('type', 'village')
                        xml_settlement.text = place
                        xml_placeName.append(xml_settlement)
                        xml_form.append(xml_placeName)

                    xml_ref.append(xml_form)
                    xml_sense.append(xml_ref)

                elif element['tag'] == 'style':
                    xml_usg = etree.Element('usg')
                    xml_usg.set('type', 'style')
                    xml_usg.text = element['content']
                    xml_sense.append(xml_usg)

                elif element['tag'] == 'place':
                    xml_placeName = etree.Element('placeName')
                    xml_settlement = etree.Element('settlement')
                    xml_settlement.set('type', 'village')
                    xml_settlement.text = element['content']
                    xml_placeName.append(xml_settlement)
                    xml_sense.append(xml_placeName)

            xml_entry.append(xml_sense)

        xml_body.append(xml_entry)

    xml_text.append(xml_body)
    xml_dict.append(xml_text)

    return xml_doc


def create_zip(xml_doc):
    with codecs.open('./static/data/ustya_dictionary.xml', 'w') as w:
        xml_doc.write(w, encoding='utf-8')

    z = zipfile.ZipFile('./static/data/ustya_dictionary_tei.zip', 'w')
    z.write('./static/data/ustya_dictionary.xml')

    os.remove('./static/data/ustya_dictionary.xml')


def main():
    index = []
    for entry in entries('./output'):
        index.append(entry)

    xml_doc = create_tei_xml(index)
    create_zip(xml_doc)


if __name__ == '__main__':
    main()
