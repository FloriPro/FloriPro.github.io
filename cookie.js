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
    document.cookie = "hasAccepted=True";
    document.getElementsByClassName('CookieAccept')[0].style.display = "none";
    document.getElementsByClassName('Site')[0].style.display = "block";
}


window.addEventListener('load', function () {
    let hasAccepted = getCookie("hasAccepted");
    if (hasAccepted == "True") {
        document.getElementsByClassName('CookieAccept')[0].style.display = "none";
    }
    else {
        console.log("none");
        document.getElementsByClassName('Site')[0].style.display = "none";
        document.getElementsByClassName('CookieAccept')[0].style.display = "block";
    }
})