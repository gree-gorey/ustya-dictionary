import os
import json
import codecs
import zipfile


def create_zip_with_json(dictionary):
    with codecs.open('./static/data/ustya_dictionary.json', 'w', 'utf-8') as w:
        json.dump(dictionary, w, ensure_ascii=False, indent=2)

    z = zipfile.ZipFile('./static/data/ustya_dictionary_json.zip', 'w')
    z.write('./static/data/ustya_dictionary.json')

    os.remove('./static/data/ustya_dictionary.json')


def main():
    pass


if __name__ == '__main__':
    main()
