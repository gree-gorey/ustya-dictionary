$(function() {
    $.get( "_user_info", function(data) {
        // console.log(data.result);
        var logged_in = data.result["logged"];

        if (logged_in) {
            let name = data.result["name"];

            let greeting = document.getElementById("greeting");
            greeting.innerText = "logged in as: ";

            let nameElement = document.getElementById("name");
            nameElement.innerText = name;

            let logButton = document.getElementById("logButton");
            logButton.setAttribute("value", "log out");
            logButton.setAttribute("onClick", "window.location='/logout';");

            let newEntryButton = document.getElementById("new-entry");
            newEntryButton.style["display"] = "inline-block";
        }
    });
});