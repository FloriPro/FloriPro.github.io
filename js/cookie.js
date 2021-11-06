function getCookie(name) {
    var dc,
        prefix,
        begin,
        end;
    dc = document.cookie;
    prefix = name + "=";
    begin = dc.indexOf("; " + prefix);
    end = dc.length;
    if (begin !== -1) {
        begin += 2;
    } else {
        begin = dc.indexOf(prefix);
        if (begin === -1 || begin !== 0) return null;
    }
    if (dc.indexOf(";", begin) !== -1) {
        end = dc.indexOf(";", begin);
    }
    return decodeURI(dc.substring(begin + prefix.length, end)).replace(/\"/g, '');
}

function AcceptCookie() {
    document.cookie = "hasAccepted=True; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    document.getElementsByClassName('Site')[0].style.display = "block";
    fadeOutEffect()
}


window.addEventListener('load', function () {
    let hasAccepted = getCookie("hasAccepted");
    if (hasAccepted == "True") {
        if (getCookie("washere")!="true") {
            addMessage("Willkommen zurück!")
        }
        setCookie("washere", "true", 0.1);
        document.getElementsByClassName('CookieAccept')[0].style.display = "none";
    }
    else {
        document.getElementsByClassName('Site')[0].style.display = "none";
        document.getElementById("CookieAccept").style.opacity = 1;
        document.getElementsByClassName('CookieAccept')[0].style.display = "block";
    }
})

//fade Out Cookie Message
function fadeOutEffect() {
    addMessage("Herzlich willkommen, auf meiner Seite. Du wirst hier leider nichts Finden, da es nichts gibt... RIP")
    if (urlParams.get("page") == null) {
        loadNavBarAndMore("Home")
    } else {
        loadNavBarAndMore(urlParams.get("page"));
    }
    if (location.hash != "") {
        $('html, body').animate({
            scrollTop: $(location.hash).offset().top
        }, 500);
    }
    var fadeTarget = document.getElementById("CookieAccept");
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.01;
        } else {
            clearInterval(fadeEffect);
            document.getElementsByClassName('CookieAccept')[0].style.display = "none";
        }
    }, 1);
}