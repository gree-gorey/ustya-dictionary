// НОВЫЙ POS В ЗАГОЛОВКЕ
function addNewPosInHeader() {
    var forms = document.getElementById("forms");
    forms.appendChild(renderEmptyHeaderPosRow());
    currentRow ++;
}

function renderEmptyHeaderPosRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderHeaderPosBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyHeaderPosInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderEmptyHeaderPosInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input pos-word-input header-place-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "pos_" + currentRow);
    input.setAttribute("value", "");
    return input;
}

// НОВЫЙ СТИЛЬ В ЗАГОЛОВКЕ
function addNewStyleInHeader() {
    var forms = document.getElementById("forms");
    forms.appendChild(renderEmptyHeaderStyleRow());
    currentRow ++;
}

function renderEmptyHeaderStyleRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderHeaderStyleBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyHeaderStyleInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderEmptyHeaderStyleInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input pos-word-input header-place-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "style_" + currentRow);
    input.setAttribute("value", "");
    return input;
}

// НОВОЕ МЕСТО В ЗАГОЛОВКЕ
function addNewPlaceInHeader() {
    var forms = document.getElementById("forms");
    forms.appendChild(renderEmptyHeaderPlaceRow());
    currentRow ++;
}

function renderEmptyHeaderPlaceRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderHeaderPlaceBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyHeaderPlaceInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderEmptyHeaderPlaceInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input pos-word-input header-place-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "place_" + currentRow);
    input.setAttribute("value", "");
    return input;
}

// НОВОЕ СЛОВО В ЗАГОЛОВКЕ
function addNewFormInHeader() {
    var forms = document.getElementById("forms");
    forms.appendChild(renderEmptyFormRow());
    currentRow ++;
}

function renderEmptyFormRow() {
    var formDiv = document.createElement("div");
    formDiv.setAttribute("class", "row form-row list-group-item");
    formDiv.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderFormBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderLabel(local[lang]["word"]));
    twelveColumns.appendChild(renderEmptyWordInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderLabel(local[lang]["type"]));
    twelveColumns.appendChild(renderEmptySelect());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyAnaLabel());
    twelveColumns.appendChild(renderEmptyAnaInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyStyleLabel());
    twelveColumns.appendChild(renderEmptyStyleInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyPlaceLabel());
    twelveColumns.appendChild(renderEmptyPlaceInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderDeleteButton());

    formDiv.appendChild(twelveColumns);

    return formDiv;
}

function renderEmptyWordInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "word_" + currentRow);
    input.setAttribute("value", "");
    return input;
}

function renderEmptySelect() {
    var select = document.createElement("select");
    select.setAttribute("class", "word-input");
    select.setAttribute("id", "type_" + currentRow);

    select.appendChild(renderEmptyOption("lemma"));

    select.appendChild(renderEmptyOption("variant"));

    select.appendChild(renderEmptyOption("inflected"));

    return select;
}

function renderEmptyOption(optionName) {
    var option = document.createElement("option");
    option.setAttribute("value", optionName);
    option.innerHTML = local[lang][optionName];
    if (optionName == "variant") {
        option.setAttribute("selected", "selected");
    }
    return option;
}

function renderEmptyAnaLabel() {
    var label = document.createElement("label");
    label.setAttribute("class", "switch switch-slide");

    var input = document.createElement("input");
    input.setAttribute("class", "switch-input");
    input.setAttribute("what-to-disable", "ana_" + currentRow);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", "handleChange(this);");
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

function renderEmptyAnaInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input ana-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "ana_" + currentRow);
    input.disabled = true;
    return input;
}

function renderEmptyStyleLabel() {
    var label = document.createElement("label");
    label.setAttribute("class", "switch switch-slide");

    var input = document.createElement("input");
    input.setAttribute("class", "switch-input");
    input.setAttribute("what-to-disable", "style_" + currentRow);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", "handleChange(this);");
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

function renderEmptyStyleInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input style-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "style_" + currentRow);
    input.disabled = true;
    return input;
}

function renderEmptyPlaceLabel() {
    var label = document.createElement("label");
    label.setAttribute("class", "switch switch-slide");

    var input = document.createElement("input");
    input.setAttribute("class", "switch-input");
    input.setAttribute("what-to-disable", "place_" + currentRow);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", "handleChange(this);");
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

function renderEmptyPlaceInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input place-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "place_" + currentRow);
    input.disabled = true;
    return input;
}

// НОВЫЙ POS В SENSE
function addNewPos(parentName) {
    var group = document.getElementById(parentName);
    group.appendChild(renderEmptyPosRow());
    currentRow ++;
}

function renderEmptyPosRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderPosBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyPosInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderEmptyPosInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input pos-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "pos_" + currentRow);
    input.setAttribute("value", "");
    return input;
}

// НОВЫЙ DEF В SENSE
function addNewDef(parentName) {
    var group = document.getElementById(parentName);
    group.appendChild(renderEmptyDefRow());
    currentRow ++;
}

function renderEmptyDefRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderBadgeInSenseContainer(local[lang]["def"]));
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyDefTextArea());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderEmptyDefTextArea() {
    var textArea = document.createElement("textarea");
    textArea.setAttribute("class", "def-textarea");
    textArea.setAttribute("id", "def_" + currentRow);
    textArea.rows = 2;

    return textArea;
}

// НОВЫЙ FORM В SENSE
function addNewFormInSense(parentName) {
    var group = document.getElementById(parentName);
    group.appendChild(renderEmptyFormInSenseRow());
    currentRow ++;
}

function renderEmptyFormInSenseRow() {
    var formDiv = document.createElement("div");
    formDiv.setAttribute("class", "row form-row list-group-item");
    formDiv.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderFormInSenseBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderLabel(local[lang]["ana"]));
    twelveColumns.appendChild(renderEmptyRefAna());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderLabel(local[lang]["word"]));
    twelveColumns.appendChild(renderEmptyRefInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyStyleRefLabel());
    twelveColumns.appendChild(renderEmptyStyleRefInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyPlaceRefLabel());
    twelveColumns.appendChild(renderEmptyPlaceRefInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    formDiv.appendChild(twelveColumns);

    return formDiv;
}

function renderEmptyStyleRefLabel() {
    var label = document.createElement("label");
    label.setAttribute("class", "switch switch-slide");

    var input = document.createElement("input");
    input.setAttribute("class", "switch-input");
    input.setAttribute("what-to-disable", "style_" + currentRow);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", "handleChange(this);");
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

function renderEmptyStyleRefInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input sense-style-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "style_" + currentRow);
    input.disabled = true;
    return input;
}

function renderEmptyPlaceRefLabel() {
    var label = document.createElement("label");
    label.setAttribute("class", "switch switch-slide");

    var input = document.createElement("input");
    input.setAttribute("class", "switch-input");
    input.setAttribute("what-to-disable", "place_" + currentRow);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", "handleChange(this);");
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

function renderEmptyPlaceRefInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input sense-place-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "place_" + currentRow);
    input.disabled = true;
    return input;
}

function renderEmptyRefAna() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input ana-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "ref_ana_" + currentRow);
    input.setAttribute("value", "");
    return input;
}

function renderEmptyRefInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input ref-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "ref_input_" + currentRow);
    input.setAttribute("value", "");
    return input;
}

// НОВЫЙ REF В SENSE
function addNewRef(parentName) {
    var group = document.getElementById(parentName);
    group.appendChild(renderEmptyRefRow());
    currentRow ++;
}

function renderEmptyRefRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderRefBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderLabel(local[lang]["ana"]));
    twelveColumns.appendChild(renderEmptyRefAna());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderLabel(local[lang]["word"]));
    twelveColumns.appendChild(renderEmptyRefInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyStyleRefLabel());
    twelveColumns.appendChild(renderEmptyStyleRefInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyPlaceRefLabel());
    twelveColumns.appendChild(renderEmptyPlaceRefInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

// НОВЫЙ STYLE В SENSE
function addNewStyleInSense(parentName) {
    var group = document.getElementById(parentName);
    group.appendChild(renderEmptyStyleInSenseRow());
    currentRow ++;
}

function renderEmptyStyleInSenseRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderStyleBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyStyleInSenseInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderEmptyStyleInSenseInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input pos-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "style_" + currentRow);
    return input;
}

// НОВЫЙ PLACE В SENSE
function addNewPlaceInSense(parentName) {
    var group = document.getElementById(parentName);
    group.appendChild(renderEmptyPlaceInSenseRow());
    currentRow ++;
}

function renderEmptyPlaceInSenseRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderPlaceBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyPlaceInSenseInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderEmptyPlaceInSenseInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input pos-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "place_" + currentRow);
    return input;
}

// НОВЫЙ QUOTE В SENSE
function addNewQuoteInSense(parentName) {
    var group = document.getElementById(parentName);
    group.appendChild(renderEmptyQuoteInSenseRow());
    currentRow ++;
}

function renderEmptyQuoteInSenseRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row list-group-item");
    row.setAttribute("id", "row_" + currentRow);

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderQuoteBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyQuoteInSenseInput());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderEmptyQuoteInSenseInput() {
    var input = document.createElement("input");
    input.setAttribute("class", "word-input pos-word-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "quote_" + currentRow);
    return input;
}

// НОВЫЙ EXAMPLE В SENSE
function addNewExample(parentName) {
    var group = document.getElementById(parentName);
    group.appendChild(renderEmptyExampleContainer());
    currentRow ++;
}

function renderEmptyExampleContainer() {
    var container = document.createElement("div");
    container.setAttribute("class", "list-group-item");
    container.setAttribute("example", "example");
    container.setAttribute("id", "row_" + currentRow);

    container.appendChild(renderEmptyExampleRow());

    container.appendChild(renderEmptyTranslationRow());

    container.appendChild(renderEmptyBiblRow());

    return container;
}

function renderEmptyBiblRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row");

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderEmptyBiblBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyTextAreaBibl());
    twelveColumns.appendChild(renderSpace());

    row.appendChild(twelveColumns);

    return row;
}

function renderEmptyBiblBadge() {
    var label = document.createElement("label");
    label.setAttribute("class", "switch switch-slide switch-translation");

    var input = document.createElement("input");
    input.setAttribute("class", "switch-input");
    input.setAttribute("what-to-disable", "bibl_" + currentRow);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", "handleChange(this);");
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

function renderEmptyTextAreaBibl() {
    var textArea = document.createElement("textarea");
    textArea.setAttribute("class", "def-textarea");
    textArea.setAttribute("id", "bibl_" + currentRow);
    textArea.disabled = true;
    textArea.rows = 1;

    return textArea;
}

function renderEmptyTranslationRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row");

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderEmptyTranslationBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyTextAreaTranslation());
    twelveColumns.appendChild(renderSpace());

    row.appendChild(twelveColumns);

    return row;
}

function renderEmptyTranslationBadge() {
    var label = document.createElement("label");
    label.setAttribute("class", "switch switch-slide switch-translation");

    var input = document.createElement("input");
    input.setAttribute("class", "switch-input");
    input.setAttribute("what-to-disable", "translation_" + currentRow);
    input.setAttribute("type", "checkbox");
    input.setAttribute("onchange", "handleChange(this);");
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

function renderEmptyTextAreaTranslation() {
    var textArea = document.createElement("textarea");
    textArea.setAttribute("class", "def-textarea");
    textArea.setAttribute("id", "translation_" + currentRow);
    textArea.disabled = true;
    textArea.rows = 1;

    return textArea;
}

function renderEmptyExampleRow() {
    var row = document.createElement("div");
    row.setAttribute("class", "row form-row");

    var twelveColumns = document.createElement("div");
    twelveColumns.setAttribute("class", "twelve columns");

    twelveColumns.appendChild(renderExampleBadge());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderEmptyTextAreaExample());
    twelveColumns.appendChild(renderSpace());

    twelveColumns.appendChild(renderRemoveRow());

    row.appendChild(twelveColumns);

    return row;
}

function renderEmptyTextAreaExample() {
    var textArea = document.createElement("textarea");
    textArea.setAttribute("class", "def-textarea");
    textArea.setAttribute("id", "example_" + currentRow);

    return textArea;
}

///////////////////////////////////////////////

function addNewSense() {
    var senses = document.getElementById("senses");
    senses.appendChild(renderEmptySenseContainer());
    createSort("sense_" + currentContainer);
    currentContainer ++;
}

function renderEmptySenseContainer() {
    var entryContainer = document.createElement("div");
    entryContainer.setAttribute("class", "container entry-container");
    entryContainer.setAttribute("id", "container_" + currentContainer);

    entryContainer.appendChild(renderSenseBadge());

    entryContainer.appendChild(renderEmptySenseGroup());

    entryContainer.appendChild(renderSenseButtonsFirstRow());

    entryContainer.appendChild(renderSenseButtonsSecondRow());

    return entryContainer;
}

function renderEmptySenseGroup() {
    var group = document.createElement("div");
    group.setAttribute("class", "list-group");
    group.setAttribute("id", "sense_" + currentContainer);

    return group;
}


function removeMe(divId) {
    var element = document.getElementById(divId);
    element.parentNode.removeChild(element);
}

