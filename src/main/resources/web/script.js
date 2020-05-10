$(document).ready(function() {

    let today1;
    function getCurrentTime() {
        today1 = new Date();
        return "[" + String(today1.getDate()).padStart(2, '0') + "-" + String(today1.getMonth() + 1).padStart(2, '0')
            + "-" + today1.getFullYear() + " " + String(today1.getHours()).padStart(2, '0') + ":" +
            String(today1.getMinutes()).padStart(2, '0') + ":" + String(today1.getSeconds()).padStart(2, '0') + "] ";
    }
    
    let userItems = null;

    // Ensures the first view for the user is the login page or the fridge page if the user is recognized
    console.log(getCurrentTime() + "Sending: " + "POST" + " on url: " + "/login/returning");
    $.ajax({
        method: "POST",
        url: "/login/returning",
        success: function (res1, res2, res3) {
            console.log(getCurrentTime() + "Received success code: " + res3.status + " " + res3.statusText);
            changeView('fridge');
        },
        error: function (result) {
            console.log(getCurrentTime() + "Received error code: " + result.status + " " + result.statusText);
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
            history.replaceState({view}, "", "/" + view);
            console.log(getCurrentTime() + "Changed view to " + view + " & replaced state " + history.state.view);
        } else if (window.location.pathname !== "/" + view) {
            history.pushState({view}, "", "/" + view);
            console.log(getCurrentTime() + "Changed view to " + view + " & pushed state " + history.state.view);
        } else {
            console.log(getCurrentTime() + "Changed view to " + view);
        }
    }

    // What happens when you press the back button in the browser
    window.onpopstate = function () {
        //console.log(getCurrentTime() + history.state.view)
        if (history.state.view !== null) {
            changeView(history.state.view);
        }
    };

    function getUserInfo() {
        console.log(getCurrentTime() + "Sending: " + "GET" + " on url: " + "/user/info");
        $.ajax({
            method: "GET",
            url: "/user/info",
            success: function (result) {
                console.log(getCurrentTime() + "Received success object: " + result);
                $(".dropdown-button").html(result.username + " &#9660");
            },
            error: function (result) {
                console.log(getCurrentTime() + "Received error code: " + result.status + " " + result.statusText);
                if (result.status === 401) {
                    console.log(getCurrentTime() + "Re-login required")
                    logout();
                }
            }
        });
    }


    /* ---- page login ---- */
    $('#button-login').click(function () {
        console.log(getCurrentTime() + "Sending: " + "POST" + " on url: " + "/login");

        let queryparams = "?username=" + $("#field-brugernavn").val() + "&password=" + $("#field-password").val();

        $("#login-error").html("");

        $.ajax({
            method: "POST",
            url: "/login/" + queryparams,
            success: function (res1, res2, res3) {
                console.log(getCurrentTime() + "Received success code: " + res3.status + " " + res3.statusText);
                changeView("fridge");
            },
            error: function (result) {
                console.log(getCurrentTime() + "Received error code: " + result.status + " " + result.statusText);
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
        $("#mail-success").html("");
        $("#email").val("");
    }

    //TODO get username, and send email via "send" button
    $("#button-send-email").click(function () {
        console.log(getCurrentTime() + "Sending: " + "POST" + " on url: " + "/login/forgot");

        $("#mail-success").html("");
        let username = $("#email").val();

        $.ajax({
            method: "POST",
            url: "/login/forgot/?username=" + username,
            success: function (res1, res2, res3) {
                console.log(getCurrentTime() + "Received success code: " + res3.status + " " + res3.statusText);
                $("#mail-success").html("Mail sendt");
                $("#email").val("");
            },
            error: function (result) {
                console.log(getCurrentTime() + "Received error code: " + result.status + " " + result.statusText);
                $("#mail-success").html("Fejl: mail ikke sendt");
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
        logout();
    });

    function logout() {
        document.cookie = "javalin-cookie-store=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "./";
    }

    $("#settings-button").click(function () {
        changeView('user');
    });


    /* - Inside settings - */
    $(".change-password").click(function () {
        console.log(getCurrentTime() + "Sending: " + "PUT" + " on url: " + "/user/change-password");

        $("#change-password-error").html("");

        var query = "?oldpassword=" + $("#oldpassword").val() + "&newpassword=" + $("#newpassword").val();

        $.ajax({
            method: "PUT",
            url: "/user/change-password/" + query,
            success: function (res1, res2, res3) {
                console.log(getCurrentTime() + "Received success code: " + res3.status + " " + res3.statusText);
                changeView("fridge");
            },
            error: function (result) {
                console.log(getCurrentTime() + "Received error code: " + result.status + " " + result.statusText);
                $("#change-password-error").html("Fejl, kunne ikke ændre kodeord.");
                if (result.status === 401) {
                    console.log(getCurrentTime() + "Re-login required")
                    logout();
                }
            }
        });
    });

    $("#annuller").click(function () {
        changeView("fridge");
    });


    function loadItems() {
        console.log(getCurrentTime() + "Sending: " + "GET" + " on url: " + "/fridge/items");

        $(".grid").html("");

        $.ajax({
            method: "GET",
            url: "/fridge/items",
            success: function (result) {
                console.log(getCurrentTime() + "Received success object: " + JSON.stringify(result));
                userItems = result;

                for (item in result) {
                    //console.log(getCurrentTime() + result[item])
                    if (item !== '0') {
                        showItem(result[item]);
                    }
                }

            },
            error: function (result) {
                console.log(getCurrentTime() + "Received error code: " + result.status + " " + result.statusText);
                if (result.status === 401) {
                    console.log(getCurrentTime() + "Re-login required")
                    logout();
                }
            }
        });
    }

    $("#search-field").on('input', function () {
        term = $("#search-field").val();
        if (term === "") {
            //console.log(getCurrentTime() + "Loading all")
            loadItems();
            return;
        }

        //console.log(getCurrentTime() + "Searching items");
        $(".grid").html("");

        for (item in userItems) {
            //console.log(getCurrentTime() + userItems[item])
            if (item !== '0') {
                if (userItems[item][0].toUpperCase().indexOf(term.toUpperCase()) !== -1) {
                    showItem(userItems[item]);
                }
                if (userItems[item][1].toUpperCase().indexOf(term.toUpperCase()) !== -1) {
                    showItem(userItems[item]);
                }
                if (userItems[item][3].toUpperCase().indexOf(term.toUpperCase()) !== -1) {
                    showItem(userItems[item]);
                }
                if (userItems[item][6].toUpperCase().indexOf(term.toUpperCase()) !== -1) {
                    showItem(userItems[item]);
                }
            }
        }
    })

    /* -- grid food items -- */
    function showItem(item) {

        let expiration = item[1].split("-");

        // The code below, until comment: 'end snippet', is taken from the stackoverflow.com answer by user
        // 'Samuel Meddows' on Feb. 8. 2011 at the following link: https://stackoverflow.com/a/4929629
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = String(today.getFullYear());
        // end snippet

        /*
        console.log(getCurrentTime() + yyyy + " === " + expiration[0] + " && " + mm + " === " + expiration[1] + " && " + dd + " > " + expiration[2]);
        console.log(getCurrentTime() + yyyy === expiration[0]);
        console.log(getCurrentTime() + mm === expiration[1]);
        console.log(getCurrentTime() + dd > expiration[2]);
        console.log(getCurrentTime() + yyyy === expiration[0] && mm === expiration[1] && dd > expiration[2]);
        */

        let status;
        if (yyyy > expiration[0]) {
            // If current year is bigger than expiration year
            status = "    <img class=\"box-status\" src=\"images/red.png\">\n";
        } else if (yyyy === expiration[0] && mm > expiration[1]) {
            // If current year is same as expiration but current month is bigger than expiration month
            status = "    <img class=\"box-status\" src=\"images/red.png\">\n";
        } else if (yyyy === expiration[0] && mm === expiration[1] && dd > expiration[2]) {
            // If current year and month is same as expiration but current date is bigger than expiration date
            status = "    <img class=\"box-status\" src=\"images/red.png\">\n";
        } else if (yyyy === expiration[0] && mm === expiration[1] && (expiration[2] - dd) <= 1) {
            // If current year and month is same as expiration but the difference between expiration date and current date is 1 or less
            status = "    <img class=\"box-status\" src=\"images/red.png\">\n";
        } else if (yyyy === expiration[0] && mm === expiration[1] && (expiration[2] - dd) <= 3) {
            // If current year and month is same as expiration but the difference between expiration date and current date is 3 or less
            status = "    <img class=\"box-status\" src=\"images/yellow.png\">\n";
        } else {
            // If the date is any other, the status must be good
            status = "    <img class=\"box-status\" src=\"images/green.png\">\n";
        }

        $(".grid").append("" +
            "<div class=\"item\">\n" +
            "    <img class=\"box-visual\" src=\"images/box.png\">\n" +
            status +
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
        //console.log(getCurrentTime() + "Tilføjet boks!")

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
        console.log(getCurrentTime() + "Sending: " + "DELETE" + " on url: " + "/fridge/delete-item");

        $.ajax({
            method: "DELETE",
            url: "/fridge/delete-item/?item-ID=" + itemID,
            success: function (res1, res2, res3) {
                console.log(getCurrentTime() + "Received success code: " + res3.status + " " + res3.statusText);
                loadItems();
                $("#search-field").val("");
            },
            error: function (result) {
                console.log(getCurrentTime() + "Received error code: " + result.status + " " + result.statusText);
                if (result.status === 401) {
                    console.log(getCurrentTime() + "Re-login required")
                    logout();
                }
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

        console.log(getCurrentTime() + "Sending: " + "GET" + " on url: " + "/fridge/new-item/types");

        $("#food-name").val("");
        $("#amount").val("");
        $("#type").val("");
        $("#date").val("");

        $.ajax({
            method: "GET",
            url: "/fridge/new-item/types",
            success: function (result) {
                console.log(getCurrentTime() + "Received success object: " + JSON.stringify(result));
                $("#type").html("");

                for (item in result) {
                    //console.log(getCurrentTime() + result[item])
                    if (item !== '0') {
                        $("#type").append("<option value=\"" + result[item][0] + "\">" + result[item][1] + "</option>");
                    }
                }
            },
            error: function (result) {
                console.log(getCurrentTime() + "Received error code: " + result.status + " " + result.statusText);
                if (result.status === 401) {
                    console.log(getCurrentTime() + "Re-login required")
                    logout();
                }
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

        console.log(getCurrentTime() + "Sending: " + "POST" + " on url: " + "/fridge/new-item with JSON data: " + data);

        $.ajax({
            method: "POST",
            url: "/fridge/new-item",
            data: data,
            contentType: "application/json",
            success: function (res1, res2, res3) {
                console.log(getCurrentTime() + "Received success code: " + res3.status + " " + res3.statusText);
                loadItems();
                closeModal();
            },
            error: function (result) {
                console.log(getCurrentTime() + "Received error code: " + result.status + " " + result.statusText);
                if (result.status === 401) {
                    console.log(getCurrentTime() + "Re-login required")
                    logout();
                }
            }
        });
    });

    //TODO make search bar work + button

    /* CALENDAR --------------------------------------------------------------------------
        $("#select-date").oninput(function () {
            let date = document.querySelector('input[type="date"]');
            console.log(getCurrentTime() + date);

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
        console.log(getCurrentTime() + $('#select-date').val());
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
