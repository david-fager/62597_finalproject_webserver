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

});
