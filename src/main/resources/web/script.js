$(function () {

    $("#asd").click(function () {
        console.log("Trykket på!")

        $("#hej").append("" +
            "<div class=\"item\">\n" +
            "    <img class=\"box\" src=\"images/box.png\" height=\"80\">\n" +
            "    <img class=\"status\" src=\"images/green.png\">\n" +
            "    <p class=\"text\">Tomater</p>\n" +
            "    <p class=\"amount\">x2</p>\n" +
            "    <p class=\"date\">23/04/20</p>\n" +
            "</div>");

    });



});
