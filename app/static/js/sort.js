// // Simple list
// window.onload = function(){
//     forms = document.getElementById("forms");
//     Sortable.create(forms, { /* options */ });
//
//     // forms = document.getElementById("forms");
//     // Sortable.create(forms, { /* options */ });
//
//     // List with handle
//     // forms = document.getElementById("forms");
//     // // console.log(listWithHandle);
//     // Sortable.create(forms, {
//     //   handle: '.glyphicon-move',
//     //   animation: 150
//     // });
// };

function createSort(tag) {
    var forms = document.getElementById(tag);
    Sortable.create(forms, { /* options */ });
}