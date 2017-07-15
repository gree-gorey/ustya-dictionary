function previewEntry() {
    var entryObject = parseEntry();
    // console.log(entryObject);
    var openedWindow = window.open("/preview", "_blank", "height=400,width=700");
    $(openedWindow).load(function () {
        createEntry(entryObject, openedWindow);
    });
}

function parseEntry() {
    var entry = {};
    entry["header"] = parseHeader();
    entry["senses"] = parseSenses();
    entry["type"] = parseType();
    // console.log(entry);
    return entry;
}

function parseType() {
    var typeCheckBox = document.getElementById("type");
    if (typeCheckBox.checked) {
        return "idiom"
    } else {
        return "word"
    }
}

function parseHeader() {
    var header = {
            "forms": [],
            "style": [],
            "place": [],
            "pos": ""
        };

    var headerElements = document.getElementById("forms").children;
    for (let i = 0; i < headerElements.length; i++) {
        let features = headerElements[i].children[0];
        let tag = features.children[0].innerText;
        if (tag == local[lang]["form"]) {
            var form = {"style": [], "place": []};
            form["content"] = features.children[3].value;
            form["type"] = features.children[6].value;
            // console.log(features.children[6].value);

            if (features.children[8].children[0].checked) {
                form["ana"] = features.children[9].value;
            }

            if (features.children[11].children[0].checked) {
                form["style"] = features.children[12].value.split(", ");
            }

            if (features.children[14].children[0].checked) {
                form["place"] = features.children[15].value.split(", ");
            }
            header["forms"].push(form);
        } else if (tag == local[lang]["style"]) {
            let styles = features.children[2].value.split(", ");
            header["style"] = header["style"].concat(styles);
        } else if (tag == local[lang]["place"]) {
            let places = features.children[2].value.split(", ");
            header["place"] = header["place"].concat(places);
        } else if (tag == local["short"][lang]["pos"]) {
            header["pos"] = features.children[2].value;
            // console.log("foo");
        }
    }

    return header;
}

function parseSenses() {
    var senses = [];

    var senseContainers = document.getElementById("senses").children;
    for (let i = 0; i < senseContainers.length; i++) {
        senses.push(parseOneSense(senseContainers[i], i));
    }
    return senses;
}

function parseOneSense(senseContainer, i) {
    var sense = {"elements": [], "n": i+1};

    var senseElements = senseContainer.children[1].children;
    for (let i = 0; i < senseElements.length; i++) {
        if (!senseElements[i].getAttribute("example")) {
            let features = senseElements[i].children[0];
            let tag = features.children[0].innerText;
            if (tag == local[lang]["pos"]) {
                let element = {"tag": "pos"};
                element["content"] = features.children[2].value;
                sense["elements"].push(element);
            } else if (tag == local[lang]["def"]) {
                let element = {"tag": "def"};
                element["content"] = features.children[2].value;
                sense["elements"].push(element);
            } else if (tag == local[lang]["ref"] || tag == local[lang]["form"]) {
                let element = {"style": [], "place": []};
                if (tag == local[lang]["ref"]) {
                    element["tag"] = "ref";
                } else {
                    element["tag"] = "form";
                }
                element["ana"] = features.children[3].value;
                if (tag == local[lang]["form"] && element["ana"]) {
                    element["type"] = "inflected";
                }

                element["content"] = features.children[6].value;

                if (features.children[8].children[0].checked) {
                    element["style"] = features.children[9].value.split(", ");
                }

                if (features.children[11].children[0].checked) {
                    element["place"] = features.children[12].value.split(", ");
                }

                sense["elements"].push(element);
            } else if (tag == local[lang]["quote"]) {
                let element = {"tag": "quote"};
                element["content"] = features.children[2].value;
                sense["elements"].push(element);
            } else if (tag == local[lang]["style"]) {
                let element = {"tag": "style"};
                element["content"] = features.children[2].value;
                sense["elements"].push(element);
            } else if (tag == local[lang]["place"]) {
                let element = {"tag": "place"};
                element["content"] = features.children[2].value;
                sense["elements"].push(element);
            }

        } else {
            let element = {"tag": "example", "translation": "", "bibl": ""};
            let example = senseElements[i].children[0];
            let features = example.children[0];
            element["content"] = features.children[2].value;

            if (senseElements[i].children[1].children[0].children[0].children[0].checked) {
                element["translation"] = senseElements[i].children[1].children[0].children[2].value;
            }

            if (senseElements[i].children[2].children[0].children[0].children[0].checked) {
                element["bibl"] = senseElements[i].children[2].children[0].children[2].value;
            }

            sense["elements"].push(element);
        }
    }

    return sense;
}

function saveEntry() {
    window.onbeforeunload = null;
    var args = getValuesFromUrl();
    if (args["edit"] == "edit") {
        var index = args["id"]
    } else {
        index = 0
    }
    var entryObject = parseEntry();
    var jsonToServer = {"index": index, "entry": entryObject, "edit": args["edit"]};
    var body = document.body;
    body.className = "loading";
    $.ajax({
        url: '_save',
        type: 'post',
        data: JSON.stringify(jsonToServer),
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
            let feedback = data.result["feedback"];
            let id = data.result["id"];
    
            if (feedback == "success") {
                let ok = document.getElementById('ok');
                ok.onclick = function () {
                    window.location.assign("/search?id=" + id);
                };
                showSuccessMessage();                
            } else {
                let ok = document.getElementById('ok');
                ok.onclick = function () {
                    hideSuccessMessage();
                };
                
                let message = document.getElementById('message');
                message.innerText = "Невозможно сохранить статью. Обратитесь к администрации.";
                showSuccessMessage();
            }
        }
    }).done(function() {
        body.className = "";
    });
}

function showSuccessMessage() {
    var modal = document.getElementById('successMessage');
    modal.style.display = "block";
}

function hideSuccessMessage() {
    var modal = document.getElementById('successMessage');
    modal.style.display = "none";
}

function showSureBox() {
    var modal = document.getElementById('sureMessage');
    modal.style.display = "block";
}

function hideSureBox() {
    var modal = document.getElementById('sureMessage');
    modal.style.display = "none";
}

function showSureDeleteBox() {
    var modal = document.getElementById('sureDeleteMessage');
    modal.style.display = "block";
}

function hideSureDeleteBox() {
    var modal = document.getElementById('sureDeleteMessage');
    modal.style.display = "none";
}

function showSuccessDeleteMessage() {
    var modal = document.getElementById('successDeleteMessage');
    modal.style.display = "block";
}

function hideSuccessDeleteMessage() {
    var modal = document.getElementById('successDeleteMessage');
    modal.style.display = "none";
}

function deleteEntry() {
    window.onbeforeunload = null;
    var args = getValuesFromUrl();
    var index = args["id"];
    var jsonToServer = {"index": index};
    var body = document.body;
    body.className = "loading";
    $.ajax({
        url: '_delete',
        type: 'post',
        data: JSON.stringify(jsonToServer),
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
            let feedback = data.result["feedback"];
    
            if (feedback == "success") {
                let ok = document.getElementById('okDelete');
                ok.onclick = function () {
                    window.location.assign("/search");
                };
                showSuccessDeleteMessage();
            } else {
                let ok = document.getElementById('okDelete');
                ok.onclick = function () {
                    hideSuccessDeleteMessage();
                };
                
                let message = document.getElementById('messageDelete');
                message.innerText = "Невозможно удалить статью. Обратитесь к администрации.";
                showSuccessDeleteMessage();
            }
        }
    }).done(function() {
        body.className = "";
    });
}