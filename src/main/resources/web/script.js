$(function () {

    $("#asd").click(function () {
        console.log("Trykket på!")

        $("#hej").append("" +
            "<div class=\"item\">\n" +
            "    <img id=\"box\" src=\"images/box.png\" height=\"80\">\n" +
            "    <img id=\"status\" src=\"images/green.png\">\n" +
            "    <p id=\"text\">Tomater</p>\n" +
            "    <p id=\"amount\">x2</p>\n" +
            "    <p id=\"date\">23/04/20</p>\n" +
            "</div>");

    });



});
