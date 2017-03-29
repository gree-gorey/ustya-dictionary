$(function () {
    var body = document.body;
    body.className = "loading";
    let args = getValuesFromUrl();
    $.getJSON('/_get_letter_list', {
      slice: args["slice"]
    }, function(data) {
        let myWindow = window;
        createLetterLinks(data.result["links"]);
        createLetterTitle(data.result["links"][args["slice"]]);
        var entries = data.result['entries'];
        for (let i = 0; i < entries.length; i++) {
            let entryObject = entries[i]['_source'];
            let id = entries[i]["_id"];
            createEntry(entryObject, myWindow, id, "explore", data.result["links"][args["slice"]]);
        }
        var items = myWindow.document.getElementsByClassName("entry-list");
        items[items.length-1].className = "entry entry-list last-entry";
        console.log();
    }).done(function() {
        body.className = "";
    });
});

function createLetterLinks(links) {
    var linksDiv = document.getElementById("letter-links");
    for (let i = 0; i < links.length; i++) {
        let link = document.createElement("a");
        link.className = "letters";
        link.setAttribute("onClick", "window.location='/explore?slice=" + i + "';");
        link.innerHTML = links[i];

        let space = document.createElement("span");
        space.innerHTML = ' ';

        linksDiv.appendChild(link);
        linksDiv.appendChild(space);
    }
}

function createLetterTitle(titleText) {
    var results = document.getElementById("results");
    var title = document.createElement("div");
    title.id = "title";
    title.innerHTML = titleText;

    results.appendChild(title);
}
