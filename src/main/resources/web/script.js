$(function () {

    $("#button-new-box").click(function () {
        console.log("Tilføjet boks!")

        $("#items").append("" +
            "<div class=\"item\">\n" +
            "    <img class=\"box-visual\" src=\"images/box.png\">\n" +
            "    <img class=\"box-status\" src=\"images/green.png\">\n" +
            "    <div class=\"box-content\">\n" +
            "        <div class=\"content-text\">\n" +
            "            <p>Tomater</p>\n" +
            "            <p>x2</p>\n" +
            "            <p>23/04/20</p>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>");
    });



});
