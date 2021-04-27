/*
$(function () {
    
    // register button effect
    $("#submit-btn").animate({backgroundColor:"#542344"},1000);
    $("#submit-btn").animate({backgroundColor:"#99D19C"},1000);
    setInterval(function () {       // free play effect
    $("#submit-btn").animate({backgroundColor:"#542344"},1000,function(){$("#submit-btn").animate({backgroundColor:"#99D19C"},1000)});
    },2000);
    setInterval(function () {       // free play effect
        $("#free-play").effect("pulsate", setTimeout(function () {
            $("#free-play").effect("shake")
        }, 1500));
    }, 3000);
    
    
    $("#register-btn").click(function(){
        $("#register").show("bounce");
    })
    
    
});

*/


$(

    function () {
        var currentCenter;
        var interval1;

        function left(element, using) {
            element.position({
                my: "right middle",
                at: "left+25 middle",
                of: "#container",
                collision: "none",
                using: using
            });
        }

        function right(element, using) {
            element.position({
                my: "left middle",
                at: "right-25 middle",
                of: "#container",
                collision: "none",
                using: using
            });
        }

        function center(element, using) {
            element.position({
                my: "center middle",
                at: "center middle",
                of: "#container",
                using: using
            });
        }

        left($("img:eq(5)"));
        center($("img:eq(6)"));
        right($("img:eq(7)"));
        currentCenter = 5;

        function animate(to) {
            $(this).stop(true, false).animate(to);
        }

        function next(event) {
            //event.preventDefault();

            center($("img:eq(7)"), animate);
            left($("img:eq(6)"), animate);
            right($("img:eq(5)").appendTo("#container"));
        }

        function previous(event) {
            event.preventDefault();
            center($("img:eq(5)"), animate);
            right($("img:eq(6)"), animate);
            left($("img:eq(7)").prependTo("#container"));
        }

        $(".slideshow").on("click", function (event) {
            $(".slideshow").index(this) === 5 ? previous(event) : next(event);
        });

        $(window).on("resize", function () {
            left($("img:eq(5)"), animate);
            center($("img:eq(6)"), animate);
            right($("img:eq(7)"), animate);
        });

        interval1 = setInterval(function () {
            next();
        }, 3000);

        $(".play").hover(function () {
            $(this).css({
                backgroundColor: "blue"
            }); /// CHANGE THIS BAD COLOR
        });
        $(".play").mouseleave(function () {
            $(this).css({
                backgroundColor: "#E15254ff"
            });
        });

        $("#pacman").click(
            function () {
                location.assign("./Pacman/pacman.html");
            });

        $("#zombies").click(
            function () {
                location.assign("./PlantsVsZombies/StartPage.html");
            });

        $("#play").click(
            function () {
            }
        );


        // register button effect
        $("#submit-btn").animate({
            backgroundColor: "#E15254ff"
        }, 1000);
        $("#submit-btn").animate({
            backgroundColor: "#99D19C"
        }, 1000);
        setInterval(function () { // free play effect
            $("#submit-btn").animate({
                backgroundColor: "#E15254ff"
            }, 1000, function () {
                $("#submit-btn").animate({
                    backgroundColor: "#99D19C"
                }, 1000)
            });
        }, 2000);
        setInterval(function () { // free play effect
            $("#free-play").effect("pulsate", setTimeout(function () {
                $("#free-play").effect("shake")
            }, 1500));
        }, 3000);

        $("#submit-btn").click(
            function () {
                var invalidCredentials = false;
                var message = "";
                var mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                if ($("#name").val() == "") {
                    invalidCredentials = true;
                    message = "Name Cant Be Empty\r\n";
                    $("#name").css({
                        border: "2px solid red"
                    });
                    setTimeout(
                        function () {
                            $("#name").css("border", "0")
                        }, 4000);
                }
                if ($("#pass").val() == "") {
                    invalidCredentials = true;
                    message += ("Password Cant Be Empty\r\n");
                    $("#pass").css({
                        border: "2px solid red"
                    });
                    setTimeout(
                        function () {
                            $("#pass").css("border", "0");
                        },4000);
                }

                if (!($("#mail").val().match(mailFormat))) {
                    invalidCredentials = true;
                    message += ("Invalid email format");
                    $("#mail").css({
                        border: "2px solid red"
                    });
                    setTimeout(function () {
                        $("#mail").css("border", "0")
                    }, 4000);
                }
                if (!invalidCredentials) {
                    $L.setCookie("username", $("#name").val());
                    $L.setCookie("userpass", $("#pass").val());
                    $L.setCookie("usermail", $("#mail").val());
                    $L.setCookie("usergender", $("#slct1 option:selected").val());
                    alert("Success!");
                    $("#register").toggle("bounce");
                    $("#log-in-div").toggle("bounce");
                } else
                    alert(message);
            }
        );

        $("#signup").click(function () {
            $("#register").toggle("bounce");
            $("#log-in-div").hide("bounce");
            $("#container").toggle();
            $("#games-id").toggle();
            $("home").hide();
            
        })


        $("#login").click(
            function () {
                $("#register").hide("bounce");
                $("#log-in-div").toggle("bounce");
                $("#container").toggle();
                $("#games-id").toggle();
                $("home").toggle();
            });
        

    }

);
