function addChar(id, char) {
    var caretPos = document.getElementById(id).selectionStart;
    var textAreaTxt = $(document.getElementById(id)).val();
    var txtToAdd = char;
    $(document.getElementById(id)).val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos) );
}

var lastFocus;
var caret;

var keys = {
    "#acute": "́",
    "#short-u": "ў",
    "#caps-short-u": "Ў"
};

function addKeyBoard() {
    var $all_inputs = $("input:text, textarea");

    $all_inputs.blur(function(){
        lastFocus = this;
        caret = this.selectionStart;
    });

    $all_inputs.click(function(event){
        var id = this.id;
        event.stopPropagation();
        $("#add").show();

        for (let buttonId in keys) {
            let button = $(buttonId);
            button.off().on('click', function(event) {
                addChar(id, keys[buttonId]);

                event.preventDefault();
                event.stopPropagation();
                if (lastFocus) {
                    setTimeout(function() {lastFocus.focus()}, 10);
                    if (caret) {
                        lastFocus.selectionStart = caret + 1;
                        lastFocus.selectionEnd = caret + 1;
                    }
                }
                event.stopPropagation();
                return(false);
            });
        }

    });

    $(window).click(function() {
        $("#add").hide();
    });

    $("#add").click(function(event){
        event.preventDefault();
        event.stopPropagation();
        if (lastFocus) {
            setTimeout(function() {lastFocus.focus()}, 10);
        }
        event.stopPropagation();
        return(false);
    });
}

// $(function () {
//     var $all_inputs = $("input:text, textarea");
//
//     $all_inputs.blur(function(){
//         lastFocus = this;
//         caret = this.selectionStart;
//     });
//
//     $all_inputs.click(function(event){
//         var id = this.id;
//         event.stopPropagation();
//         $("#add").show();
//
//         for (let buttonId in keys) {
//             let button = $(buttonId);
//             button.off().on('click', function(event) {
//                 addChar(id, keys[buttonId]);
//
//                 event.preventDefault();
//                 event.stopPropagation();
//                 if (lastFocus) {
//                     setTimeout(function() {lastFocus.focus()}, 10);
//                     if (caret) {
//                         lastFocus.selectionStart = caret + 1;
//                         lastFocus.selectionEnd = caret + 1;
//                     }
//                 }
//                 event.stopPropagation();
//                 return(false);
//             });
//         }
//
//     });
//
//     $(window).click(function() {
//         $("#add").hide();
//     });
//
//     $("#add").click(function(event){
//         event.preventDefault();
//         event.stopPropagation();
//         if (lastFocus) {
//             setTimeout(function() {lastFocus.focus()}, 10);
//         }
//         event.stopPropagation();
//         return(false);
//     });
// });
