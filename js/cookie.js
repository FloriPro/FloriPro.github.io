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
    document.getElementsByClassName('alert')[0].style.display = 'block';
    document.getElementsByClassName('alert')[0].style.marginTop = "0px";
    document.cookie = "hasAccepted=True; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    document.getElementsByClassName('Site')[0].style.display = "block";
    fadeOutEffect()
}


window.addEventListener('load', function () {
    let hasAccepted = getCookie("hasAccepted");
    if (hasAccepted == "True") {
        document.getElementsByClassName('CookieAccept')[0].style.display = "none";
    }
    else {
        document.getElementsByClassName('Site')[0].style.display = "none";
        document.getElementById("CookieAccept").style.opacity = 1;
        document.getElementsByClassName('CookieAccept')[0].style.display = "block";
    }
})


//fadeOutWelcome Message
function moveAwayEffect() {
    var moveAwayTarget = document.getElementsByClassName("alert")[0];
    var moveAwayTargetStyleMarginTopI = 0
    moveAwayTarget.style.marginTop = "0px";
    var moveAwayEffect = setInterval(function () {
        if (moveAwayTargetStyleMarginTopI > -(moveAwayTarget.offsetHeight + 10)) {
            moveAwayTargetStyleMarginTopI -= 1
            moveAwayTarget.style.marginTop = moveAwayTargetStyleMarginTopI + "px";
        } else {
            clearInterval(moveAwayEffect);
            document.getElementsByClassName('alert')[0].style.display = "none";
        }
    }, 10);
}

//fade Out Cookie Message
function fadeOutEffect() {
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