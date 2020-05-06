$(function () {

    $(".page-login").show();
    $(".page-management").hide();
    $(".user-management").hide();

    $("#button-login").click(function () {
        $(".page-login").hide();
        $(".page-management").show();
    });


    $(".dropdown-button").click(function () {
        $("#user-dropdown").toggle("show");
        /*
            var dropdown = document.getElementsByClassName("dropdown-contains");
            var i;
            for (i = 0; i < dropdown.length; i++) {
                var openDropdown = dropdown[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        */
    });

    $(".profile").click(function () {
        $(".page-login").hide();
        $(".page-management").hide();
        $(".user-management").show();
    });

    $(".logud").click(function () {
        //TODO logud  function
    });

    $("#button-new-box").click(function () {
        console.log("Tilføjet boks!")

        $(".grid").append("" +
            "<div class=\"item\">\n" +
            "    <img class=\"box-visual\" src=\"images/box.png\">\n" +
            "    <img class=\"box-status\" src=\"images/green.png\">\n" +
            "    <img class=\"trash-icon\" src=\"images/trash_icon.png\" onclick='this.parentNode.remove()'>\n" +
            "    <div class=\"box-content\">\n" +
            "        <div class=\"content-text\">\n" +
            "            <h5 class\"item-name\">PLACEHOLDER</h5>\n" +
            "            <h5 class=\"item-amount\">999 tilbage</h5>\n" +
            "            <h5 class=\"item-dato\">Udl.: 00/00/00</h5>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>");
    });


/*
    $("#select-date").oninput(function () {
        var date = document.querySelector('input[type="date"]');
        console.log(date);

        $(".date-grid").append("" + "<h3 class=\"selected-date\">1/1/11</h3>\n" +
            "<div id=\"item-calendar\">\n" +
            "<p id=\"item-name-calendar\">Tomat</p>\n" +
            "<p id=\"item-amount-calendar\">2 tilbage</p>\n" +
            "</div>\n"
        );

    });
*/

    document.getElementById('select-date').addEventListener('change', function() {
        console.log($('#select-date').val());
    });

    /*
    $("#slider-right").click(function () {
        $("#box-right").animate({width: 'toggle'}, 350);
    });
    */

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
