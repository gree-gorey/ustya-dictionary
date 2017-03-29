function downloadTEI() {
    var body = document.body;
    body.className = "loading";
    $.ajax({
        url: '_export_tei',
        type: 'get',
        success: function (data) {
            let feedback = data.result;

            if (feedback == "success") {
                window.open('/static/data/ustya_dictionary_tei.zip', '_blank');
            } else {
                let ok = document.getElementById('ok');
                ok.onclick = function () {
                    hideSuccessMessage();
                };

                let message = document.getElementById('message');
                message.innerText = "Невозможно скачать словарь. Обратитесь к администрации.";
                showSuccessMessage();
            }
        }
    }).done(function() {
        body.className = "";
    });
}


function downloadJSON() {
    var body = document.body;
    body.className = "loading";
    $.ajax({
        url: '_export_json',
        type: 'get',
        success: function (data) {
            let feedback = data.result;

            if (feedback == "success") {
                window.open('/static/data/ustya_dictionary_json.zip', '_blank');
            } else {
                let ok = document.getElementById('ok');
                ok.onclick = function () {
                    hideSuccessMessage();
                };

                let message = document.getElementById('message');
                message.innerText = "Невозможно скачать словарь. Обратитесь к администрации.";
                showSuccessMessage();
            }
        }
    }).done(function() {
        body.className = "";
    });
}