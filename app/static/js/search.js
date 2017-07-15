function search() {
    var body = document.body;
    body.className = "loading";
    document.getElementById("results").innerHTML = "";
    document.title = "Поиск";
    $.getJSON('/_query', {
        query: $('input#query').val(),
        parameter: $("#parameters").val()
    }, function (data) {
        myData = data;
        var result_nodes = createResult();
        document.getElementById("results").appendChild(result_nodes);
    }).done(function () {
        body.className = "";
    });
}

function createResult() {
    var result_nodes = document.createElement("div");
    result_nodes.setAttribute('id', 'results');

    // console.log(myData);

    var result = myData.result;
    if (result[0] == true) {
        var hits = result[1];

        if (hits.length == 500) {
            let entry = largeResultList();
            result_nodes.appendChild(entry);
        }

        for (let i = 0; i < hits.length; i++) {
            let id = hits[i]["_id"];
            if (hits[i]["_source"]['header']['forms'].length > 0) {
                let entry = createEntryLink(hits[i]["_source"]['header']['forms'][0]['content'], id);
                result_nodes.appendChild(entry);
            } else {
                let entry = createEntryLink('[ пустой заголовок ]', id);
                result_nodes.appendChild(entry);
            }
        }
    } else {
        let entry = notFound();
        result_nodes.appendChild(entry);
    }
    return result_nodes;
}

function notFound() {
    var entry = document.createElement("div");
    entry.className = "entry";

    var header = document.createElement("div");
    header.className = "entry-header-view";

    var span = document.createElement("span");
    span.innerHTML = 'Не найдено.';
    header.appendChild(span);
    entry.appendChild(header);
    return entry;
}

function largeResultList() {
    var entry = document.createElement("div");
    entry.className = "entry";

    var header = document.createElement("div");
    header.className = "entry-header-view";

    var span = document.createElement("span");
    span.innerHTML = "Показаны первые 500 результатов.";
    header.appendChild(span);

    var br = document.createElement("br");
    header.appendChild(br);

    entry.appendChild(header);
    entry.appendChild(br);
    return entry;
}

function createEntryLink(hit, id) {
    var entry = document.createElement("div");
    entry.className = "entry";

    var header = document.createElement("div");
    header.className = "entry-header-view";

    let attributes = {"id": id};

    // window.location.assign(getUrl("/search", attributes));

    var lemma = document.createElement("a");
    lemma.className = "lemma";
    lemma.setAttribute("href", getUrl("/search", attributes));
    lemma.setAttribute("target", "_blank");
    // lemma.setAttribute("onClick", "localStorage.setItem('afterEditor', false); var myWindow = window.open('/search', '_blank'); createResultObject(" + i + ", myWindow);");
    lemma.innerHTML = hit;
    header.appendChild(lemma);
    entry.appendChild(header);
    return entry;
}

function createResultObject(i, myWindow) {
    var result = myData.result;
    var entryObject = result[1][i]["_source"];
    var id = result[1][i]["_id"];
    createEntry(entryObject, myWindow, id);
}

function capitalizeFirstLetter(string) {
    if (string.length > 0) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return "";
    }
}

function createEntry(entryObject, myWindow, id = null, mode = "search", letters = null) {

    var entry = myWindow.document.createElement("div");

    if (mode == "search") {
        if (entryObject['header']['forms'].length > 0) {
            myWindow.document.title = capitalizeFirstLetter(entryObject['header']['forms'][0]['content'])
        } else {
            myWindow.document.title = "[no title]"
        }

        entry.className = "entry";
    } else {
        myWindow.document.title = letters;
        entry.className = "entry entry-list";
    }

    var header = myWindow.document.createElement("div");
    header.className = "entry-header-view";

    // ОБХОДИМ ФОРМЫ
    var forms = entryObject['header']['forms'];
    for (let j = 0; j < forms.length; j++) {

        // ЕСЛИ ЭТО КОСВЕННАЯ ФОРМА -- УКАЗЫВАЕМ
        if (forms[j]['type'] == 'inflected') {
            let ana = myWindow.document.createElement("span");
            ana.className = 'style';
            ana.innerHTML = forms[j]['ana'] + ' ';
            header.appendChild(ana);
        }

        // САМО СЛОВО, КРУПНО
        let lemma = myWindow.document.createElement("span");
        lemma.className = "lemma";
        lemma.innerHTML = forms[j]['content'];
        header.appendChild(lemma);

        // ЕСЛИ ЕСТЬ ДЕРЕВНИ -- ПЕРЕЧИСЛЯЕМ В СКОБКАХ ЧЕРЕЗ ЗАПЯТУЮ
        for (let k = 0; k < forms[j]['place'].length; k++) {
            if (k == 0) {
                let open_bracket = myWindow.document.createElement("span");
                open_bracket.className = 'style';
                open_bracket.innerHTML = ' (';
                header.appendChild(open_bracket);
            }

            let place = myWindow.document.createElement("span");
            place.className = 'style';
            place.innerHTML = forms[j]['place'][k];
            header.appendChild(place);

            if (k < (forms[j]['place'].length - 1)) {
                let comma = myWindow.document.createElement("span");
                comma.innerHTML = ', ';
                header.appendChild(comma);
            } else {
                let close_bracket = myWindow.document.createElement("span");
                close_bracket.className = 'style';
                close_bracket.innerHTML = ')';
                header.appendChild(close_bracket);
            }
        }

        // ЕСЛИ ЕСТЬ СТИЛИ -- УКАЗЫВАЕМ
        for (let k = 0; k < forms[j]['style'].length; k++) {
            let open_bracket = myWindow.document.createElement("span");
            open_bracket.className = 'style';
            open_bracket.innerHTML = ' (';
            header.appendChild(open_bracket);

            var style = myWindow.document.createElement("span");
            style.className = 'style';
            style.innerHTML = forms[j]['style'][k];
            header.appendChild(style);

            if (k < (forms[j]['place'].length - 1)) {
                let comma = myWindow.document.createElement("span");
                comma.innerHTML = ', ';
                header.appendChild(comma);
            } else {
                let close_bracket = myWindow.document.createElement("span");
                close_bracket.className = 'style';
                close_bracket.innerHTML = ')';
                header.appendChild(close_bracket);
            }
        }

        // ЕСЛИ ЭТО НЕ ПОСЛЕДНЯЯ ФОРМА В СПИСКЕ -- СТАВИМ ЗАПЯТУЮ
        if (j < (forms.length - 1)) {
            let comma = myWindow.document.createElement("span");
            comma.innerHTML = ', ';
            header.appendChild(comma);
        }
    }

    var styles = entryObject['header']['style'];

    // НОВАЯ СТРОКА ДЛЯ СТИЛЕЙ
    if (styles.length > 0) {
        let br = myWindow.document.createElement("br");
        header.appendChild(br);
    }

    // ОБХОДИМ И ПИШЕМ СТИЛИ
    for (let j = 0; j < styles.length; j++) {
        let style = myWindow.document.createElement("span");
        style.className = "style";
        style.innerHTML = styles[j];
        header.appendChild(style);
        if (j < (styles.length - 1)) {
            let comma = myWindow.document.createElement("span");
            comma.innerHTML = ', ';
            header.appendChild(comma);
        }
    }

    var places = entryObject['header']['place'];

    // НОВАЯ СТРОКА ДЛЯ МЕСТ
    if (places.length > 0) {
        let br = myWindow.document.createElement("br");
        header.appendChild(br);
    }

    // ОБХОДИМ И ПИШЕМ ДЕРЕВНИ
    for (let j = 0; j < places.length; j++) {
        let place = myWindow.document.createElement("span");
        place.className = "style";
        place.innerHTML = places[j];
        header.appendChild(place);
        if (j < (places.length - 1)) {
            let comma = myWindow.document.createElement("span");
            comma.innerHTML = ', ';
            header.appendChild(comma);
        }
    }

    var pos = entryObject['header']['pos'];

    // НОВАЯ СТРОКА ДЛЯ POS
    if (pos != "") {
        let br = myWindow.document.createElement("br");
        header.appendChild(br);

        let posElement = myWindow.document.createElement("span");
        posElement.className = "style";
        posElement.innerHTML = pos;
        header.appendChild(posElement);
    }

    $.get("_user_info", function (data) {
        // console.log(data.result);
        var logged_in = data.result["logged"];

        if (logged_in && id != null) {
            let space = myWindow.document.createElement("span");
            space.innerHTML = ' ';
            header.appendChild(space);

            let attributes = {"id": id, "edit": "edit"};

            let editLink = document.createElement("a");
            editLink.className = "edit-link";
            editLink.setAttribute("href", getUrl("/edit", attributes));
            editLink.innerHTML = "[редактировать]";
            header.appendChild(editLink);
        }
    });

    entry.appendChild(header);

    var sense_view = myWindow.document.createElement("div");
    sense_view.className = "sense-view";

    var senses = entryObject['senses'];
    for (let j = 0; j < senses.length; j++) {
        var sense = myWindow.document.createElement("div");
        sense.className = 'single-sense-box';
        if (senses.length > 1) {
            let number = myWindow.document.createElement("span");
            number.className = "number";
            number.innerHTML = senses[j]['n'] + '. ';
            sense.appendChild(number);
        }

        var elements = senses[j]['elements'];
        for (let k = 0; k < elements.length; k++) {

            if (elements[k]['tag'] == 'example') {
                let br = myWindow.document.createElement("br");
                sense.appendChild(br);

                let example = myWindow.document.createElement("span");
                example.className = elements[k]['tag'];
                example.innerHTML = elements[k]['content'];
                sense.appendChild(example);

                if (elements[k]['translation'] != '') {
                    let dash = myWindow.document.createElement("span");
                    dash.innerHTML = ' — ';
                    sense.appendChild(dash);

                    let translation = myWindow.document.createElement("span");
                    translation.innerHTML = elements[k]['translation'];
                    translation.className = 'translation';
                    sense.appendChild(translation);
                }

                if (elements[k]['bibl'] != '') {
                    let open_bracket = myWindow.document.createElement("span");
                    open_bracket.innerHTML = ' [';
                    sense.appendChild(open_bracket);

                    let bibl = myWindow.document.createElement("span");
                    bibl.innerHTML = elements[k]['bibl'];
                    bibl.className = 'bibl';
                    sense.appendChild(bibl);

                    let close_bracket = myWindow.document.createElement("span");
                    close_bracket.innerHTML = '] ';
                    sense.appendChild(close_bracket);
                }

            } else if (elements[k]['tag'] == 'ref') {
                // если есть предыдущие элементы
                if (k - 1 >= 0) {
                    // если предыдущий тоже ссылка
                    if (elements[k-1]['tag'] == 'ref') {
                        // если сокращения совпаают
                        if (elements[k-1]['ana'] == elements[k]['ana']) {
                            let comma = myWindow.document.createElement("span");
                            comma.innerHTML = ', ';
                            sense.appendChild(comma);
                        // если сокращения разные
                        } else {
                            let br = myWindow.document.createElement("br");
                            sense.appendChild(br);

                            let ana = myWindow.document.createElement("span");
                            ana.className = 'style';
                            ana.innerHTML = elements[k]['ana'];
                            sense.appendChild(ana);

                            let space = myWindow.document.createElement("span");
                            space.innerHTML = ' ';
                            sense.appendChild(space);
                        }
                    // если предыдущий НЕ ссылка
                    } else {
                        let br = myWindow.document.createElement("br");
                        sense.appendChild(br);

                        let ana = myWindow.document.createElement("span");
                        ana.className = 'style';
                        ana.innerHTML = elements[k]['ana'];
                        sense.appendChild(ana);

                        let space = myWindow.document.createElement("span");
                        space.innerHTML = ' ';
                        sense.appendChild(space);
                    }
                // если НЕТ предыдущих элементов
                } else {
                    let ana = myWindow.document.createElement("span");
                    ana.className = 'style';
                    ana.innerHTML = elements[k]['ana'];
                    sense.appendChild(ana);

                    let space = myWindow.document.createElement("span");
                    space.innerHTML = ' ';
                    sense.appendChild(space);
                }
                // if (sense.childNodes.length > 0) {
                //     var previousTagClass = sense.childNodes[sense.childNodes.length - 1].className;
                //
                //
                //
                //     //console.log(previousTagClass);
                //
                //     if (previousTagClass == 'lemma') {
                //         let comma = myWindow.document.createElement("span");
                //         comma.innerHTML = ', ';
                //         sense.appendChild(comma);
                //     } else {
                //         let br = myWindow.document.createElement("br");
                //         sense.appendChild(br);
                //
                //         let ana = myWindow.document.createElement("span");
                //         ana.className = 'style';
                //         ana.innerHTML = elements[k]['ana'];
                //         sense.appendChild(ana);
                //
                //         let space = myWindow.document.createElement("span");
                //         space.innerHTML = ' ';
                //         sense.appendChild(space);
                //     }
                // } else {
                //     let ana = myWindow.document.createElement("span");
                //     ana.className = 'style';
                //     ana.innerHTML = elements[k]['ana'];
                //     sense.appendChild(ana);
                //
                //     let space = myWindow.document.createElement("span");
                //     space.innerHTML = ' ';
                //     sense.appendChild(space);
                // }

                var ref = document.createElement("a");
                ref.className = "lemma";
                ref.setAttribute("onClick", "searchRef('" + elements[k]['normalized_content'] + "');");
                ref.innerHTML = elements[k]['content'];
                sense.appendChild(ref);

                if (elements[k]['style'].length != 0) {
                    let open_bracket = myWindow.document.createElement("span");
                    open_bracket.className = 'style';
                    open_bracket.innerHTML = ' (';
                    sense.appendChild(open_bracket);

                    let styles = elements[k]['style'].join(", ");

                    let stylesElement = document.createElement("span");
                    stylesElement.className = "style";
                    stylesElement.innerHTML = styles;
                    sense.appendChild(stylesElement);

                    let close_bracket = myWindow.document.createElement("span");
                    close_bracket.className = 'style';
                    close_bracket.innerHTML = ')';
                    sense.appendChild(close_bracket);
                }

                if (elements[k]['place'].length != 0) {
                    let open_bracket = myWindow.document.createElement("span");
                    open_bracket.className = 'style';
                    open_bracket.innerHTML = ' (';
                    sense.appendChild(open_bracket);

                    let places = elements[k]['place'].join(", ");

                    let placesElement = document.createElement("span");
                    placesElement.className = "style";
                    placesElement.innerHTML = places;
                    sense.appendChild(placesElement);

                    let close_bracket = myWindow.document.createElement("span");
                    close_bracket.className = 'style';
                    close_bracket.innerHTML = ')';
                    sense.appendChild(close_bracket);
                }

            } else if (elements[k]['tag'] == 'form') {
                if (elements[k]['type'] == 'inflected') {
                    let ana = myWindow.document.createElement("span");
                    ana.className = 'style';
                    ana.innerHTML = ', ' + elements[k]['ana'] + ' ';
                    sense.appendChild(ana);
                } else {
                    let space = myWindow.document.createElement("span");
                    space.innerHTML = ' ';
                    sense.appendChild(space);
                }

                let element = myWindow.document.createElement("span");
                element.className = elements[k]['tag'];
                element.innerHTML = elements[k]['content'];
                sense.appendChild(element);

                if (elements[k]['style'].length != 0) {
                    let open_bracket = myWindow.document.createElement("span");
                    open_bracket.className = 'style';
                    open_bracket.innerHTML = ' (';
                    sense.appendChild(open_bracket);

                    let styles = elements[k]['style'].join(", ");

                    let stylesElement = document.createElement("span");
                    stylesElement.className = "style";
                    stylesElement.innerHTML = styles;
                    sense.appendChild(stylesElement);

                    let close_bracket = myWindow.document.createElement("span");
                    close_bracket.className = 'style';
                    close_bracket.innerHTML = ')';
                    sense.appendChild(close_bracket);
                }

                if (elements[k]['place'].length != 0) {
                    let open_bracket = myWindow.document.createElement("span");
                    open_bracket.className = 'style';
                    open_bracket.innerHTML = ' (';
                    sense.appendChild(open_bracket);

                    let places = elements[k]['place'].join(", ");

                    let placesElement = document.createElement("span");
                    placesElement.className = "style";
                    placesElement.innerHTML = places;
                    sense.appendChild(placesElement);

                    let close_bracket = myWindow.document.createElement("span");
                    close_bracket.className = 'style';
                    close_bracket.innerHTML = ')';
                    sense.appendChild(close_bracket);
                }

            } else if (elements[k]['tag'] == 'pos') {
                let space = myWindow.document.createElement("span");
                space.innerHTML = ' ';
                sense.appendChild(space);

                let element = myWindow.document.createElement("span");
                element.className = 'style';
                element.innerHTML = elements[k]['content'];
                sense.appendChild(element);

                let br = myWindow.document.createElement("br");
                sense.appendChild(br);
            } else if (elements[k]['tag'] == 'style') {
                let openBracket = myWindow.document.createElement("span");
                openBracket.innerHTML = ' (';
                sense.appendChild(openBracket);

                let element = myWindow.document.createElement("span");
                element.className = 'style';
                element.innerHTML = elements[k]['content'];
                sense.appendChild(element);

                let closeBracket = myWindow.document.createElement("span");
                closeBracket.innerHTML = ')';
                sense.appendChild(closeBracket);
            } else if (elements[k]['tag'] == 'place') {
                let openBracket = myWindow.document.createElement("span");
                openBracket.innerHTML = ' (';
                sense.appendChild(openBracket);

                let element = myWindow.document.createElement("span");
                element.className = 'style';
                element.innerHTML = elements[k]['content'];
                sense.appendChild(element);

                let closeBracket = myWindow.document.createElement("span");
                closeBracket.innerHTML = ')';
                sense.appendChild(closeBracket);
            } else {
                let space = myWindow.document.createElement("span");
                space.innerHTML = ' ';
                sense.appendChild(space);

                let element = myWindow.document.createElement("span");
                element.className = elements[k]['tag'];
                element.innerHTML = elements[k]['content'];
                sense.appendChild(element);
            }
        }
        sense_view.appendChild(sense);
    }

    entry.appendChild(sense_view);
    myWindow.document.getElementById("results").appendChild(entry);
    // } );
}

function searchRef(lemma) {
    var myWindow = window.open("/search", "_blank");

    var body = $(myWindow.document.body);
    body.addClass("loading");
    $.getJSON('/_query', {
        query: lemma,
        parameter: "header"
    }, function (data) {
        myWindow.onload = function () {
            // console.log("fofofofo");
            myData = data;
            var result_nodes = createResult();
            myWindow.document.getElementById("results").appendChild(result_nodes);
        };

    }).done(function () {
        body.removeClass("loading");
    });
}