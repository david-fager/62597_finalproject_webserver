$(function () {

    $("#button-new-box").click(function () {
        console.log("Tilføjet boks!")

        $(".grid").append("" +
            "<div class=\"item\">\n" +
            "    <img class=\"box-visual\" src=\"images/box.png\">\n" +
            "    <img class=\"box-status\" src=\"images/green.png\">\n" +
            "    <div class=\"box-content\">\n" +
            "        <div class=\"content-text\">\n" +
            "            <p>PLACEHOLDER</p>\n" +
            "            <p>999 tilbage</p>\n" +
            "            <p>Udl.: 00/00/00</p>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>");
    });



});
