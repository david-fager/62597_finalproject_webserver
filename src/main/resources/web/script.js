$(function () {

    function changeView(view) {
        $(".page-login").hide();
        $(".page-management").hide();
        $(".user-management").hide();
        $("." + view + "").show();
    }



    /* ---- page login ---- */
    $('#button-login').click(function () {
        var queryparams = "?username=" + $("#field-brugernavn").val() + "&password=" + $("#field-password").val()
        console.log("POSTING TO LOGIN, WITH PARAMS: " + queryparams)

        $.ajax({
            method: "POST",
            url: "/login/" + queryparams,
            success: function () {
                console.log("Success");
                changeView("page-management");
            },
            error: function () {
                console.log("Error");
            }
        });
    });



    /* -- Forgot password modal -- */
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

    //TODO get username, and send email via "send" button
    $("#button-send-email").click(function () {
        let username = document.getElementById("username2").value;
        let message = document.getElementById("message").value;
        //TODO : fetch("/login/forgot/" + username + "?message=" + message).then((response) => response.status).then(function (data) {
            console.log(data);
        //});
    });

    /* ---- page management ---- */



    /* -- Dropdown -- */
    //TODO when user logged in, set "dropdown-button" to be the users username

    $(".dropdown-button").click(function () {
        $("#user-dropdown").toggle("show");
    });

    $(".logud").click(function () {
        document.cookie = "sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "./";
    });

    $(".settings").click(function () {
        $(".page-login").hide();
        $(".page-management").hide();
        $(".user-management").show();
    });



    /* - Inside settings - */
    $(".change-password").click(function () {
        //TODO change password
        let oldpassword = document.getElementById("oldpassword").value;
        let newpassword = document.getElementById("newpassword").value;
        // TODO : fetch('/account/changePassword/' + oldpassword + "?newPassword=" + newpassword).then((response) => response.status).then(function (data) {
            console.log(data);
            if (data === 202) {
                window.location.href = '/./';
            } else if (data === 503) {
                <!-- fejl! -->
            }
        });

    $(".annuller").click(function () {
        //TODO go back to page management
        $(".page-login").hide();
        $(".page-management").show();
        $(".user-management").hide();
    });



    /* -- grid food items -- */
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



    /* -- Add food items modal -- */
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

    //TODO make them connect - add food information to item and with "add-food-item" add item to grid list.

    //TODO make search bar work + button

/* CALENDAR --------------------------------------------------------------------------
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
    ---------------------------------------------------------------------------------
*/

    //TODO Calendar
    //---------------------------->
    /*
    $("#slider-right").click(function () {
        $("#box-right").animate({width: 'toggle'}, 350);
    });
    */

    $("#slider-left").click(function () {
        $("#box-left").animate({width: 'toggle'}, 350);
    });

    document.getElementById('select-date').addEventListener('change', function() {
        console.log($('#select-date').val());
    });
    //------------------------------>




    //----------------------------------------------------End




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
