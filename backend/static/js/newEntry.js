function newEntry() {
    var resultItem = {"_source": {}};
    resultItem["_source"] = {
        "header": {
            "forms": [],
            "style": [],
            "place": [],
            "pos": ""
        },
        "senses": [
            {
                "elements": [],
                "n": "1"
            }
        ],
        "type": "word"
    };
    return resultItem;
}
