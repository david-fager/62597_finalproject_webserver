$(document).ready(function() {

    let userItems;

    // Ensures the first view for the user is the login page or the fridge page if the user is recognized
    $.ajax({
        method: "POST",
        url: "/login/returning",
        success: function () {
            console.log("Success");
            changeView('fridge');
        },
        error: function () {
            console.log("Error");
            changeView('login');
        }
    });

    // Changes the view for the single page app
    function changeView(view) {
        $(".login").hide();
        $(".fridge").hide();
        $(".user").hide();
        $("." + view + "").show();

        switch (view) {
            case 'fridge':
                loadItems();
                getUserInfo();
                break;
            default:
                break;
        }

        // If login or fridge, then dont allow top pop the state, aka. just replace it, otherwise let state be pop-able
        if (view === "login" || view === "fridge") {
            history.replaceState({view}, "", "/" + view)
            //console.log("Replaced state " + history.state.view)
        } else if (window.location.pathname !== "/" + view) {
            history.pushState({view}, "", "/" + view)
            //console.log("Pushed state " + history.state.view)
        }
    }

    // What happens when you press the back button in the browser
    window.onpopstate = function () {
        //console.log(history.state.view)
        if (history.state.view !== null) {
            changeView(history.state.view);
        }
    };

    function getUserInfo() {
        $.ajax({
            method: "GET",
            url: "/user/info",
            success: function (result) {
                console.log("Success");
                console.log(result);
                $(".dropdown-button").html(result.username + " &#9660");
            },
            error: function () {
                console.log("Error");
            }
        });
    }


    /* ---- page login ---- */
    $('#button-login').click(function () {
        let queryparams = "?username=" + $("#field-brugernavn").val() + "&password=" + $("#field-password").val();
        console.log("POSTING TO LOGIN, WITH PARAMS: " + queryparams);
        $("#login-error").html("");

        $.ajax({
            method: "POST",
            url: "/login/" + queryparams,
            success: function () {
                console.log("Success");
                changeView("fridge");
            },
            error: function (result) {
                console.log("Error " + JSON.stringify(result));
                $("#login-error").html("Forkert brugernavn eller adgangskode.");
            }
        });
    });


    /* -- Forgot password modal -- */
    let forgot_modal = document.getElementById("forgot-modal-window");
    let forgot_btn = document.getElementById("open-forgot-password");
    let forgot_span = document.getElementsByClassName("forgot-close")[0];

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
        let username = $("#email").val();
        $.ajax({
            method: "POST",
            url: "/login/forgot/?username=" + username,
            success: function () {
                console.log("Success");
            },
            error: function () {
                console.log("Error");
            }
        });
    });



    /* ---- page management ---- */


    /* -- Dropdown -- */
    //TODO when user logged in, set "dropdown-button" to be the users username
    $(".dropdown-button").click(function () {
        $("#user-dropdown").toggle("show");

    });

    $("#logud-button").click(function () {
        document.cookie = "javalin-cookie-store=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "./";
    });

    $("#settings-button").click(function () {
        changeView('user');
    });


    /* - Inside settings - */
    $(".change-password").click(function () {
        console.log("Changing password")
        $("#change-password-error").html("");

        var query = "?oldpassword=" + $("#oldpassword").val() + "&newpassword=" + $("#newpassword").val();

        $.ajax({
            method: "PUT",
            url: "/user/change-password/" + query,
            success: function () {
                console.log("Success");
                changeView("fridge");
            },
            error: function () {
                console.log("Error");
                $("#change-password-error").html("Fejl, kunne ikke ændre kodeord.");
            }
        });
    });

    $("#annuller").click(function () {
        changeView("fridge");
    });


    function loadItems() {
        console.log("Loading items");
        $(".grid").html("");

        $.ajax({
            method: "GET",
            url: "/fridge/items",
            success: function (result) {
                console.log("Success: " + JSON.stringify(result));
                userItems = result;

                for (item in result) {
                    //console.log(result[item])
                    if (item !== '0') {
                        showItem(result[item]);
                    }
                }

            },
            error: function () {
                console.log("Error");
            }
        });
    }

    /* -- grid food items -- */
    function showItem(item) {

        $(".grid").append("" +
            "<div class=\"item\">\n" +
            "    <img class=\"box-visual\" src=\"images/box.png\">\n" +
            "    <img class=\"box-status\" src=\"images/green.png\">\n" +
            "    <img class=\"trash-icon\" src=\"images/trash_icon.png\" onclick=\"removeItem("+ item[2] +")\">\n" +
            "    <div class=\"box-content\">\n" +
            "        <div class=\"content-text\">\n" +
            "            <h5 id=\"item-ID\" style=\"display: none;\">" + item[2] + "</h5>\n" +
            "            <h5 class=\"item-name\" style=\"color: #403f3f\">" + item[3] + "</h5>\n" +
            "            <h5 class=\"item-amount\" style=\"font-style: italic; color: #5a5959\">" + item[0] + " tilbage</h5>\n" +
            "            <h5 class=\"item-dato\" style=\"font-style: italic; color: #fffdfd\">Udl.: " + item[1] + "</h5>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>");
    }



    $("#button-new-box").click(function () {
        console.log("Tilføjet boks!")

        $(".grid").append("" +
            "<div class=\"item\">\n" +
            "    <img class=\"box-visual\" src=\"images/box.png\">\n" +
            "    <img class=\"box-status\" src=\"images/green.png\">\n" +
            "    <img class=\"trash-icon\" src=\"images/trash_icon.png\" onclick='this.parentNode.remove()'>\n" +
            "    <div class=\"box-content\">\n" +
            "        <div class=\"content-text\">\n" +
            "            <h5 class=\"item-name\" style=\"font-style: italic\">PLACEHOLDER</h5>\n" +
            "            <h5 class=\"item-amount\">999 tilbage</h5>\n" +
            "            <h5 class=\"item-dato\">Udl.: 00/00/00</h5>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>");
    });

    window.removeItem = function(itemID) {
        console.log(itemID)
        $.ajax({
            method: "DELETE",
            url: "/fridge/delete-item/?item-ID=" + itemID,
            success: function () {
                console.log("Success");
                loadItems();
            },
            error: function () {
                console.log("Error");
            }
        });
    }


    /* -- Add food items modal -- */
    // Get the modal
    let modal = document.getElementById("modal-window");

    // Get the button that opens the modal
    let btn = document.getElementById("modal-button");

    // Get the <span> element that closes the modal
    let span = document.getElementsByClassName("close")[0];

    btn.addEventListener('click', openModal);
    span.addEventListener('click', closeModal);

    function openModal() {
        modal.style.display = 'block';

        $.ajax({
            method: "GET",
            url: "/fridge/new-item/types",
            success: function (result) {
                $("#type").html("");
                console.log("Success: " + JSON.stringify(result));

                for (item in result) {
                    //console.log(result[item])
                    if (item !== '0') {
                        $("#type").append("<option value=\"" + result[item][0] + "\">" + result[item][1] + "</option>");
                    }
                }
            },
            error: function () {
                console.log("Error");
            }
        });
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    //TODO make them connect - add food information to item and with "add-food-item" add item to grid list.
    $(".add-food-item").click(function () {
        let data = {
            "item_name" : $("#food-name").val(),
            "item_amount" : $("#amount").val(),
            "item_type" : $("#type").val(),
            "item_date" : $("#date").val()
        };

        console.log(data);

        $.ajax({
            method: "POST",
            url: "/fridge/new-item",
            data: data,
            contentType: "application/json",
            success: function () {
                console.log("Success");
                loadItems();
                closeModal();
            },
            error: function () {
                console.log("Error");
            }
        });
    });

    //TODO make search bar work + button

    /* CALENDAR --------------------------------------------------------------------------
        $("#select-date").oninput(function () {
            let date = document.querySelector('input[type="date"]');
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

    $("#slider-left").click(function () {
        $("#box-left").animate({width: 'toggle'}, 350);
    });

    document.getElementById('select-date').addEventListener('change', function () {
        console.log($('#select-date').val());
    });
*/
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
