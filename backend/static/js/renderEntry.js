$(function () {
    let args = getValuesFromUrl();
    if ("id" in args) {
        console.log(args);
        $.getJSON('/_get_by_id', {
          index: args["id"]
        }, function(data) {
            let myWindow = window;
            let entryObject = data.result["_source"];
            let id = data.result["_id"];
            createEntry(entryObject, myWindow, id);
        });
    }
});
