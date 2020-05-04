$(function () {

    $(".page-login").show();
    $(".page-management").hide();

    $("#button-login").click(function () {
        $(".page-login").hide();
        $(".page-management").show();
    });

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

    $("#slider-right").click(function () {
        $("#box-right").animate({width: 'toggle'}, 350);
    });

    $("#slider-left").click(function () {
        $("#box-left").animate({width: 'toggle'}, 350);
    });

    // Get the modal
    var modal = document.getElementById("modal-window");

    // Get the button that opens the modal
    var btn = document.getElementById("modal-button");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    btn.addEventListener('click', openModal);
    span.addEventListener('click', closeModal);

    function openModal() {
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    var forgot_modal = document.getElementById("forgot-modal-window");
    var forgot_btn = document.getElementById("open-forgot-password");
    var forgot_span = document.getElementsByClassName("forgot-close")[0];

    forgot_btn.addEventListener('click', openForgotModal);
    forgot_span.addEventListener('click', closeForgotModal);

    function openForgotModal() {
        forgot_modal.style.display = 'block';
    }

    function closeForgotModal() {
        forgot_modal.style.display = 'none';
    }

    /*

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
    */

});
