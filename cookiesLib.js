(
    function () {
        var cookiesObj = {};

        cookiesObj.getCookie = function (cookieName) {
            if (arguments.length == 1) {
                var cookieList = cookiesObj.allCookieList();
                if (cookiesObj.hasCookie(cookieName)) return cookieList[cookieName];
            } else throw "invalid input parameters";
        }

        cookiesObj.allCookieList = function () {
            if (arguments.length == 0) {
                var cookies = document.cookie.split(";");
                var cookieList = [];
                for (var i = 0; i < cookies.length; i++) {
                    var temp = cookies[i].split("=");
                    cookieList[temp[0].trimLeft()] = temp[1];
                }
                return cookieList;
            } else throw "invalid input parameters";
        }

        cookiesObj.hasCookie = function (cookieName) {
            if (arguments.length == 1) {
                var cookieList = cookiesObj.allCookieList();
                if (cookieName in cookieList) return true;
                return false;
            } else
                throw " invalid input parameters";
        }

        cookiesObj.setCookie = function (cookieName, cookieValue, expireDate) {
            if (arguments.length == 2 || arguments.length == 3) {
                if (expireDate === undefined) document.cookie = cookieName + "=" + cookieValue;
                else document.cookie = cookieName + "=" + cookieValue + ";" + "expires=" + new Date(expireDate).toUTCString();
                if (cookiesObj.hasCookie(cookieName)) return true
                return false;
            } else throw "invalid input parameters";
        }

        cookiesObj.deleteCookie = function (cookieName) {
            if (arguments.length == 1) {
                if (cookiesObj.hasCookie(cookieName)) {
                    cookiesObj.setCookie(cookieName, "", new Date("1-1-2000"));
                    return true;
                }
                return false;
            } else throw "invalid input parameters";
        }



        // save current before assigning in case of conflict
        var _cookiesObj = window.cookiesObj;
        var _$L = window.$L;

        cookiesObj.noConflict = function () {
            if (window.cookiesObj === cookiesObj) {
                /// in case of no previous $L.
                if(_$L === undefined) throw "no conflict happened.."
                
                /// reset to previous state
                window.$L = _$L;
            }

            return cookiesObj;

        };

        // Assign cookiesObj to global window //
        window.cookiesObj = window.$L = cookiesObj;

    }

)();
