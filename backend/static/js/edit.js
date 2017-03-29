window.onbeforeunload = function() {
  return 'ВНИМАНИЕ!\nВсе несохранённые данные будут потеряны!';
};

function setButtons() {
    var $buttons = $(".add-button");

    $buttons.click(function(){
        addKeyBoard();
    });
}

currentRow = 1;
currentContainer = 1;

$(function () {
    args = getValuesFromUrl();
    if (args["edit"] == "edit") {
        var index = args["id"];
        $.getJSON('/_get_by_id', {
            index: index
        }, function(data) {
            resultItem = data.result;
            renderEditor();
        });
    } else {
        resultItem = newEntry();
        renderEditor();
        $("#delete").hide();
    }

    $("#header").text(local[lang]["header"]);
    $("#addForm").val(local[lang]["add form"]);
    $("#addStyles").val(local[lang]["add styles"]);
    $("#addPlaces").val(local[lang]["add places"]);
    $("#addPos").val(local[lang]["add pos"]);

    var $newSense = $(".new-sense");

    $newSense.click(function(){
        setButtons();
    });
});

function renderEditor() {
    if (args["edit"] == "edit") {
        if (resultItem["_source"]['header']['forms'].length > 0) {
            document.title = "Редактирование: " + resultItem["_source"]['header']['forms'][0]['normalized_content']
        } else {
            document.title = "Редактирование: [ пустой заголовок ]"
        }
    } else {
        document.title = "Новая статья"
    }

    var forms = document.getElementById("forms");
    for (let j = 0; j < resultItem["_source"]['header']['forms'].length; j++) {
        forms.appendChild(renderFormRow(j));
        currentRow ++;
    }
    if (resultItem["_source"]['header']['place'] != 0) {
        forms.appendChild(renderHeaderPlaceRow());
        currentRow ++;
    }
    if (resultItem["_source"]['header']['style'] != 0) {
        forms.appendChild(renderHeaderStyleRow());
        currentRow ++;
    }
    if (resultItem["_source"]['header']['pos'] != '') {
        forms.appendChild(renderHeaderPosRow());
        currentRow ++;
    }

    createSort("forms");

    var senses = document.getElementById("senses");
    for (var j = 0; j < resultItem["_source"]['senses'].length; j++) {
        senses.appendChild(renderSenseContainer(j));
        createSort("sense_" + currentContainer);
        currentContainer ++;
    }

    addKeyBoard();

    setButtons();
}

function renderHeaderPlaceRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderHeaderPlaceBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderHeaderPlaceInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderHeaderPlaceBadge() {
    var badge = document.createElement("span");
    badge.setAttribute("class", "badge place-badge header-place-badge");
    badge.innerHTML = local[lang]["place"];

    return badge;
}

function renderHeaderPlaceInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input pos-word-input header-place-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "place_" + currentRow);
    input.value = resultItem["_source"]['header']['place'].join(", ");
    return input;
}

function renderHeaderPosRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderHeaderPosBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderHeaderPosInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderHeaderPosBadge() {
    var badge = document.createElement("span");
    badge.setAttribute("class", "badge pos-badge header-pos-badge");
    badge.innerHTML = local["short"][lang]["pos"];

    return badge;
}

function renderHeaderPosInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input pos-word-input header-place-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "pos_" + currentRow);
    input.value = resultItem["_source"]['header']['pos'];
    return input;
}

function renderHeaderStyleRow(j, k) {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderHeaderStyleBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderHeaderStyleInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderHeaderStyleBadge() {
    var badge = document.createElement("span");
    badge.setAttribute("class", "badge style-badge");
    badge.innerHTML = local[lang]["style"];

    return badge;
}

function renderHeaderStyleInput(j, k) {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input pos-word-input header-place-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "style_" + currentRow);
    input.value = resultItem["_source"]['header']['style'].join(", ");
    return input;
}

function renderSenseContainer(j) {
    var entryContainer = document.createElement("div");
    entryContainer.setAttribute("class", "container entry-container");
    entryContainer.setAttribute("id", "container_" + currentContainer);

    entryContainer.appendChild(renderSenseBadge(j));

    entryContainer.appendChild(renderSenseGroup(j));

    entryContainer.appendChild(renderSenseButtonsFirstRow());

    entryContainer.appendChild(renderSenseButtonsSecondRow());

    return entryContainer;
}

function renderSenseButtonsFirstRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row");

    var twelveRow = document.createElement("div");
    twelveRow.setAttribute("class", "twelve columns");

    twelveRow.appendChild(renderPosButton());
    twelveRow.appendChild(renderSpace());

    twelveRow.appendChild(renderDefButton("def"));
    twelveRow.appendChild(renderSpace());

    twelveRow.appendChild(renderExampleButton());
    twelveRow.appendChild(renderSpace());

    twelveRow.appendChild(renderFormButton());

    row.appendChild(twelveRow);

    return row;
}

function renderSenseButtonsSecondRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row");

    var twelveRow = document.createElement("div");
    twelveRow.setAttribute("class", "twelve columns");

    twelveRow.appendChild(renderRefButton());
    twelveRow.appendChild(renderSpace());

    twelveRow.appendChild(renderStyleButton());
    twelveRow.appendChild(renderSpace());

    twelveRow.appendChild(renderPlaceButton());
    twelveRow.appendChild(renderSpace());

    twelveRow.appendChild(renderQuoteButton());

    row.appendChild(twelveRow);

    return row;
}

function renderPosButton() {
    var input = document.createElement("input");
    input.setAttribute("type", "button");
    input.setAttribute("class", "add-button");
    input.setAttribute("value", local[lang]["add pos"]);
    input.setAttribute("onClick", "addNewPos('sense_" + currentContainer + "');");
    return input;
}

function renderDefButton() {
    var input = document.createElement("input");
    input.setAttribute("type", "button");
    input.setAttribute("class", "add-button");
    input.setAttribute("value", local[lang]["add def"]);
    input.setAttribute("onClick", "addNewDef('sense_" + currentContainer + "');");
    return input;
}

function renderFormButton() {
    var input = document.createElement("input");
    input.setAttribute("type", "button");
    input.setAttribute("class", "add-button");
    input.setAttribute("value", local[lang]["add form"]);
    input.setAttribute("onClick", "addNewFormInSense('sense_" + currentContainer + "');");
    return input;
}

function renderRefButton() {
    var input = document.createElement("input");
    input.setAttribute("type", "button");
    input.setAttribute("class", "add-button");
    input.setAttribute("value", local[lang]["add ref"]);
    input.setAttribute("onClick", "addNewRef('sense_" + currentContainer + "');");
    return input;
}

function renderStyleButton() {
    var input = document.createElement("input");
    input.setAttribute("type", "button");
    input.setAttribute("class", "add-button");
    input.setAttribute("value", local[lang]["add styles"]);
    input.setAttribute("onClick", "addNewStyleInSense('sense_" + currentContainer + "');");
    return input;
}

function renderPlaceButton() {
    var input = document.createElement("input");
    input.setAttribute("type", "button");
    input.setAttribute("class", "add-button");
    input.setAttribute("value", local[lang]["add places"]);
    input.setAttribute("onClick", "addNewPlaceInSense('sense_" + currentContainer + "');");
    return input;
}

function renderQuoteButton() {
    var input = document.createElement("input");
    input.setAttribute("type", "button");
    input.setAttribute("class", "add-button");
    input.setAttribute("value", local[lang]["add quote"]);
    input.setAttribute("onClick", "addNewQuoteInSense('sense_" + currentContainer + "');");
    return input;
}

function renderExampleButton() {
    var input = document.createElement("input");
    input.setAttribute("type", "button");
    input.setAttribute("class", "add-button");
    input.setAttribute("value", local[lang]["add example"]);
    input.setAttribute("onClick", "addNewExample('sense_" + currentContainer + "');");
    return input;
}

function renderSenseGroup(j) {
    var group = document.createElement("div");
    group.setAttribute("class", "list-group");
    group.setAttribute("id", "sense_" + currentContainer);

    var senseElements = resultItem["_source"]['senses'][j]['elements'];
    for (var k = 0; k < senseElements.length; k++) {
        if (senseElements[k]["tag"] == "def") {
            group.appendChild(renderDefRow(j, k));
            currentRow ++;
        } else if (senseElements[k]["tag"] == "ref") {
            group.appendChild(renderRefRow(j, k));
            currentRow ++;
        } else if (senseElements[k]["tag"] == "example") {
            group.appendChild(renderExampleContainer(j, k));
            currentRow ++;
        } else if (senseElements[k]["tag"] == "pos") {
            group.appendChild(renderPosRow(j, k));
            currentRow ++;
        } else if (senseElements[k]["tag"] == "quote") {
            group.appendChild(renderQuoteRow(j, k));
            currentRow ++;
        } else if (senseElements[k]["tag"] == "style") {
            group.appendChild(renderStyleRow(j, k));
            currentRow ++;
        } else if (senseElements[k]["tag"] == "place") {
            group.appendChild(renderPlaceRow(j, k));
            currentRow ++;
        } else if (senseElements[k]["tag"] == "form") {
            group.appendChild(renderFormInSenseRow(j, k));
            currentRow ++;
        } else {
            group.appendChild(renderAnyTagRow(j, k));
            currentRow ++;
        }

    }

    return group;
}

function renderAnyTagRow(j, k) {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderBadgeInSenseContainer(resultItem["_source"]["senses"][j]["elements"][k]["tag"]));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderDefTextArea(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderFormInSenseRow(j, k) {
    var formDiv = document.createElement("div");
    formDiv.setAttribute("class", "row form-row list-group-item");
    formDiv.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderFormInSenseBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderLabel(local[lang]["ana"]));
    twelveColumns.appendChild(renderRefAna(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderLabel(local[lang]["word"]));
    twelveColumns.appendChild(renderRefInput(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderStyleRefLabel(j, k));
    twelveColumns.appendChild(renderStyleRefInput(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderPlaceRefLabel(j, k));
    twelveColumns.appendChild(renderPlaceRefInput(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    formDiv.appendChild(twelveColumns);

    return formDiv;
}

function renderFormInSenseBadge() {
    var formBadge = document.createElement("span");
    formBadge.setAttribute("class", "badge def-badge sense-form-badge");
    formBadge.innerHTML = local[lang]["form"];
    return formBadge;
}

function renderPlaceRow(j, k) {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderPlaceBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderPlaceInSenseInput(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderPlaceBadge() {
    var badge = document.createElement("span");
    badge.setAttribute("class", "badge def-badge place-badge");
    badge.innerHTML = local[lang]["place"];

    return badge;
}

function renderPlaceInSenseInput(j, k) {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input pos-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "place_" + currentRow);
    input.value = resultItem["_source"]["senses"][j]["elements"][k]["content"];
    return input;
}

function renderStyleRow(j, k) {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderStyleBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderStyleInSenseInput(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderStyleBadge() {
    var badge = document.createElement("span");
    badge.setAttribute("class", "badge def-badge style-badge");
    badge.innerHTML = local[lang]["style"];

    return badge;
}

function renderStyleInSenseInput(j, k) {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input pos-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "style_" + currentRow);
    input.value = resultItem["_source"]["senses"][j]["elements"][k]["content"];
    return input;
}

function renderExampleContainer(i, k) {
    var container = document.createElement("div");
    container.setAttribute("class", "list-group-item");
    container.setAttribute("example", "example");
    container.setAttribute("id", "row_" + currentRow);

    container.appendChild(renderExampleRow(i, k));

    container.appendChild(renderTranslationRow(i, k));

    container.appendChild(renderBiblRow(i, k));

    return container;
}

function renderBiblRow(j, k) {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row");

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderBiblBadge(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderTextAreaBibl(j, k));
    twelveColumns.appendChild(renderSpace());

    row.appendChild(twelveColumns);

    return row;
}

function renderBiblBadge(j, k) {
    var label = document.createElement("label");
    label.setAttribute("class", "switch switch-slide switch-translation");

    var input = document.createElement("input");
    input.setAttribute("class", "switch-input");
    input.setAttribute("what-to-disable", "bibl_" + currentRow);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", "handleChange(this);");
    if (resultItem["_source"]["senses"][j]["elements"][k]["bibl"] != "") {
        input.checked = true;
    }
    label.appendChild(input);

    var span = document.createElement("span");
    span.setAttribute("class", "switch-label translation-label");
    span.setAttribute("data-on", local[lang]["bibl"]);
    span.setAttribute("data-off", local[lang]["bibl"]);
    label.appendChild(span);

    var spanHandle = document.createElement("span");
    spanHandle.setAttribute("class", "switch-handle");
    label.appendChild(spanHandle);

    return label;
}

function renderTextAreaBibl(j, k) {
    var textArea = document.createElement("textarea");
    textArea.setAttribute("class", "def-textarea");
    textArea.setAttribute("id", "bibl_" + currentRow);
    textArea.disabled = true;
    textArea.rows = 1;
    if (resultItem["_source"]["senses"][j]["elements"][k]["bibl"] != "") {
        textArea.disabled = false;
        textArea.value = resultItem["_source"]["senses"][j]["elements"][k]["bibl"];
        var textLength = resultItem["_source"]["senses"][j]["elements"][k]["bibl"].length;
        textArea.rows = (textLength / 98) + 2;
    }

    return textArea;
}

function renderTranslationRow(j, k) {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row");

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderTranslationBadge(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderTextAreaTranslation(j, k));
    twelveColumns.appendChild(renderSpace());

    row.appendChild(twelveColumns);

    return row;
}

function renderTranslationBadge(j, k) {
    var label = document.createElement("label");
    label.setAttribute("class", "switch switch-slide switch-translation");

    var input = document.createElement("input");
    input.setAttribute("class", "switch-input");
    input.setAttribute("what-to-disable", "translation_" + currentRow);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", "handleChange(this);");
    if (resultItem["_source"]["senses"][j]["elements"][k]["translation"] != "") {
        input.checked = true;
    }
    label.appendChild(input);

    var span = document.createElement("span");
    span.setAttribute("class", "switch-label translation-label");
    span.setAttribute("data-on", local[lang]["translation"]);
    span.setAttribute("data-off", local[lang]["translation"]);
    label.appendChild(span);

    var spanHandle = document.createElement("span");
    spanHandle.setAttribute("class", "switch-handle");
    label.appendChild(spanHandle);

    return label;
}

function renderTextAreaTranslation(j, k) {
    var textArea = document.createElement("textarea");
    textArea.setAttribute("class", "def-textarea");
    textArea.setAttribute("id", "translation_" + currentRow);
    textArea.disabled = true;
    textArea.rows = 1;
    if (resultItem["_source"]["senses"][j]["elements"][k]["translation"] != "") {
        textArea.disabled = false;
        textArea.value = resultItem["_source"]["senses"][j]["elements"][k]["translation"];
        var textLength = resultItem["_source"]["senses"][j]["elements"][k]["translation"].length;
        textArea.rows = (textLength / 98) + 2;
    }

    return textArea;
}

function renderExampleRow(i, k) {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row");

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderExampleBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderTextAreaExample(i, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderTextAreaExample(j, k) {
    var textArea = document.createElement("textarea");
    textArea.setAttribute("class", "def-textarea");
    textArea.setAttribute("id", "example_" + currentRow);
    textArea.value = resultItem["_source"]["senses"][j]["elements"][k]["content"];

    var textLength = resultItem["_source"]["senses"][j]["elements"][k]["content"].length;
    textArea.rows = (textLength / 98) + 2;

    return textArea;
}

function renderExampleBadge() {
    var badge = document.createElement("span");
    badge.setAttribute("class", "badge example-badge");
    badge.innerHTML = local[lang]["example"];

    return badge;
}

function renderPosRow(j, k) {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderPosBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderPosInput(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderPosBadge() {
    var badge = document.createElement("span");
    badge.setAttribute("class", "badge def-badge pos-badge");
    badge.innerHTML = local[lang]["pos"];

    return badge;
}

function renderPosInput(j, k) {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input pos-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "pos_" + currentRow);
    input.value = resultItem["_source"]["senses"][j]["elements"][k]["content"];
    return input;
}

function renderQuoteRow(j, k) {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderQuoteBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderQuoteInput(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderQuoteBadge() {
    var badge = document.createElement("span");
    badge.setAttribute("class", "badge def-badge quote-badge");
    badge.innerHTML = local[lang]["quote"];

    return badge;
}

function renderQuoteInput(j, k) {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input pos-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "quote_" + currentRow);
    input.value = resultItem["_source"]["senses"][j]["elements"][k]["content"];
    return input;
}

function renderRefRow(j, k) {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderRefBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderLabel(local[lang]["ana"]));
    twelveColumns.appendChild(renderRefAna(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderLabel(local[lang]["word"]));
    twelveColumns.appendChild(renderRefInput(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderStyleRefLabel(j, k));
    twelveColumns.appendChild(renderStyleRefInput(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderPlaceRefLabel(j, k));
    twelveColumns.appendChild(renderPlaceRefInput(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderStyleRefLabel(j, k) {
    var label = document.createElement("label");
    label.setAttribute("class", "switch switch-slide");

    var input = document.createElement("input");
    input.setAttribute("class", "switch-input");
    input.setAttribute("what-to-disable", "style_" + currentRow);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", "handleChange(this);");
    if (resultItem["_source"]["senses"][j]["elements"][k]["style"].length != 0) {
        input.checked = true;
    }
    label.appendChild(input);

    var span = document.createElement("span");
    span.setAttribute("class", "switch-label");
    span.setAttribute("data-on", local[lang]["style"]);
    span.setAttribute("data-off", local[lang]["style"]);
    label.appendChild(span);

    var spanHandle = document.createElement("span");
    spanHandle.setAttribute("class", "switch-handle");
    label.appendChild(spanHandle);

    return label;
}

function renderStyleRefInput(j, k) {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input sense-style-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "style_" + currentRow);
    input.disabled = true;
    if (resultItem["_source"]["senses"][j]["elements"][k]["style"].length != 0) {
        input.disabled = false;
        input.value = resultItem["_source"]["senses"][j]["elements"][k]["style"].join(", ");
    }
    return input;
}

function renderPlaceRefLabel(j, k) {
    var label = document.createElement("label");
    label.setAttribute("class", "switch switch-slide");

    var input = document.createElement("input");
    input.setAttribute("class", "switch-input");
    input.setAttribute("what-to-disable", "place_" + currentRow);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", "handleChange(this);");
    if (resultItem["_source"]["senses"][j]["elements"][k]["place"].length != 0) {
        input.checked = true;
    }
    label.appendChild(input);

    var span = document.createElement("span");
    span.setAttribute("class", "switch-label");
    span.setAttribute("data-on", local[lang]["place"]);
    span.setAttribute("data-off", local[lang]["place"]);
    label.appendChild(span);

    var spanHandle = document.createElement("span");
    spanHandle.setAttribute("class", "switch-handle");
    label.appendChild(spanHandle);

    return label;
}

function renderPlaceRefInput(j, k) {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input sense-place-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "place_" + currentRow);
    input.disabled = true;
    if (resultItem["_source"]["senses"][j]["elements"][k]["place"].length != 0) {
        input.disabled = false;
        input.value = resultItem["_source"]["senses"][j]["elements"][k]["place"].join(", ");
    }
    return input;
}

function renderRefBadge() {
    var badge = document.createElement("span");
    badge.setAttribute("class", "badge def-badge ref-badge");
    badge.innerHTML = local[lang]["ref"];

    return badge;
}

function renderRefAna(j, k) {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input ana-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "ref_ana_" + currentRow);
    input.value = resultItem["_source"]["senses"][j]["elements"][k]["ana"];
    return input;
}

function renderRefInput(j, k) {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input ref-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "ref_input_" + currentRow);
    input.value = resultItem["_source"]["senses"][j]["elements"][k]["content"];
    return input;
}

function renderDefRow(j, k) {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderBadgeInSenseContainer(local[lang]["def"]));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderDefTextArea(j, k));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderRemoveRow() {
    var button = document.createElement("a");
    button.setAttribute("class", "button delete-button");
    button.setAttribute("onClick", "removeMe('row_" + currentRow + "');");
    button.innerHTML = "&#x2715;";

    return button;
}

function renderDefTextArea(j, k) {
    var textArea = document.createElement("textarea");
    textArea.setAttribute("class", "def-textarea");
    textArea.setAttribute("id", "def_" + currentRow);
    textArea.value = resultItem["_source"]["senses"][j]["elements"][k]["content"];

    var textLength = resultItem["_source"]["senses"][j]["elements"][k]["content"].length;
    textArea.rows = (textLength / 98) + 2;

    return textArea;
}

function renderBadgeInSenseContainer(badgeName) {
    var badge = document.createElement("span");
    badge.setAttribute("class", "badge def-badge");
    badge.innerHTML = badgeName;

    return badge;
}

function renderSenseBadge(j) {
    var row = document.createElement("div");
    row.setAttribute("class", "row");

    var twelveRow = document.createElement("div");
    twelveRow.setAttribute("class", "twelve columns header-row");

    var badge = document.createElement("span");
    badge.setAttribute("class", "badge sense-badge");
    badge.innerHTML = local[lang]["sense"];
    twelveRow.appendChild(badge);

    if (j != 0) {
        twelveRow.appendChild(renderSpace());
        twelveRow.appendChild(renderRemoveSenseButton());
    }

    row.appendChild(twelveRow);
    return row
}

function renderRemoveSenseButton() {
    var button = document.createElement("a");
    button.setAttribute("class", "button delete-button");
    button.setAttribute("onClick", "removeMe('container_" + currentContainer + "');");
    button.innerHTML = "&#x2715;";

    return button;
}

function renderFormRow(j) {
    var formDiv = document.createElement("div");
    formDiv.setAttribute("class", "row form-row list-group-item");
    formDiv.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderFormBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderLabel(local[lang]["word"]));
    twelveColumns.appendChild(renderWordInput(j));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderLabel(local[lang]["type"]));
    twelveColumns.appendChild(renderSelect(j));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderAnaLabel(j));
    twelveColumns.appendChild(renderAnaInput(j));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderStyleLabel(j));
    twelveColumns.appendChild(renderStyleInput(j));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderPlaceLabel(j));
    twelveColumns.appendChild(renderPlaceInput(j));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderDeleteButton());

    formDiv.appendChild(twelveColumns);

    return formDiv;
}

function renderFormBadge() {
    var formBadge = document.createElement("span");
    formBadge.setAttribute("class", "badge form-badge");
    formBadge.innerHTML = local[lang]["form"];
    return formBadge;
}

function renderSpace() {
    var space = document.createElement("span");
    space.className = "space";
    return space;
}

function renderLabel(labelName) {
    var label = document.createElement("span");
    label.className = "label";
    label.innerHTML = labelName;
    return label;
}

function renderWordInput(j) {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "word_" + currentRow);
    input.value = resultItem["_source"]['header']['forms'][j]['content'];
    return input;
}

function renderSelect(j) {
    var select = document.createElement("select");
    select.setAttribute("class", "word-input");
    select.setAttribute("id", "type_" + currentRow);

    select.appendChild(renderOption("lemma", j));

    select.appendChild(renderOption("variant", j));

    select.appendChild(renderOption("inflected", j));

    return select;
}

function renderOption(optionName, j) {
    var option = document.createElement("option");
    option.setAttribute("value", optionName);
    option.innerHTML = local[lang][optionName];
    if (resultItem["_source"]['header']['forms'][j]['type'] == optionName) {
        option.setAttribute("selected", "selected");
    }
    return option;
}

function renderAnaLabel(j) {
    var label = document.createElement("label");
    label.setAttribute("class", "switch switch-slide");

    var input = document.createElement("input");
    input.setAttribute("class", "switch-input");
    input.setAttribute("what-to-disable", "ana_" + currentRow);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", "handleChange(this);");
    if (resultItem["_source"]['header']['forms'][j]['type'] == "inflected") {
        input.checked = true;
    }
    label.appendChild(input);

    var span = document.createElement("span");
    span.setAttribute("class", "switch-label");
    span.setAttribute("data-on", local[lang]["ana"]);
    span.setAttribute("data-off", local[lang]["ana"]);
    label.appendChild(span);

    var spanHandle = document.createElement("span");
    spanHandle.setAttribute("class", "switch-handle");
    label.appendChild(spanHandle);

    return label;
}

function renderAnaInput(j) {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input ana-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "ana_" + currentRow);
    input.disabled = true;
    if (resultItem["_source"]['header']['forms'][j]['type'] == "inflected") {
        input.disabled = false;
        input.value = resultItem["_source"]['header']['forms'][j]['ana'];
    }
    return input;
}

function renderStyleLabel(j) {
    var label = document.createElement("label");
    label.setAttribute("class", "switch switch-slide");

    var input = document.createElement("input");
    input.setAttribute("class", "switch-input");
    input.setAttribute("what-to-disable", "style_" + currentRow);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", "handleChange(this);");
    if (resultItem["_source"]['header']['forms'][j]['style'].length != 0) {
        input.checked = true;
    }
    label.appendChild(input);

    var span = document.createElement("span");
    span.setAttribute("class", "switch-label");
    span.setAttribute("data-on", local[lang]["style"]);
    span.setAttribute("data-off", local[lang]["style"]);
    label.appendChild(span);

    var spanHandle = document.createElement("span");
    spanHandle.setAttribute("class", "switch-handle");
    label.appendChild(spanHandle);

    return label;
}

function renderStyleInput(j) {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input style-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "style_" + currentRow);
    input.disabled = true;
    if (resultItem["_source"]['header']['forms'][j]['style'].length != 0) {
        input.disabled = false;
        input.valu = resultItem["_source"]['header']['forms'][j]['style'].join(", ");
    }
    return input;
}

function renderPlaceLabel(j) {
    var label = document.createElement("label");
    label.setAttribute("class", "switch switch-slide");

    var input = document.createElement("input");
    input.setAttribute("class", "switch-input");
    input.setAttribute("what-to-disable", "place_" + currentRow);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", "handleChange(this);");
    if (resultItem["_source"]['header']['forms'][j]['place'].length != 0) {
        input.checked = true;
    }
    label.appendChild(input);

    var span = document.createElement("span");
    span.setAttribute("class", "switch-label");
    span.setAttribute("data-on", local[lang]["place"]);
    span.setAttribute("data-off", local[lang]["place"]);
    label.appendChild(span);

    var spanHandle = document.createElement("span");
    spanHandle.setAttribute("class", "switch-handle");
    label.appendChild(spanHandle);

    return label;
}

function renderPlaceInput(j) {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input place-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "place_" + currentRow);
    input.disabled = true;
    if (resultItem["_source"]['header']['forms'][j]['place'].length != 0) {
        input.disabled = false;
        input.value = resultItem["_source"]['header']['forms'][j]['place'].join(", ");
    }
    return input;
}

function renderDeleteButton() {
    var a = document.createElement("a");
    a.setAttribute("class", "button delete-button");
    a.setAttribute("onClick", "removeMe('row_" + currentRow + "');");
    a.innerHTML = "&#x2715;";
    return a;
}