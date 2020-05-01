$(function () {

    $("#asd").click(function () {
        console.log("Trykket på!")

        $("#hej").append("" +
            "<div class=\"item\">\n" +
            "    <img class=\"box\" src=\"images/box.png\" height=\"70\">\n" +
            "    <img class=\"status\" src=\"images/green.png\">\n" +
            "    <p class=\"text\">Tomater</p>\n" +
            "    <p class=\"amount\">x2</p>\n" +
            "    <p class=\"date\">23/04/20</p>\n" +
            "</div>");

    });

    $("#slider-right").click(function () {
        $("#box-right").animate({width:'toggle'},350);
    });

    $("#slider-left").click(function () {
        $("#box-left").animate({width:'toggle'},350);
    });

    // Get the modal
    var modal = document.getElementById("modal-window");

// Get the button that opens the modal
    var btn = document.getElementById("modal-button");

// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    };

// When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    };

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

});
