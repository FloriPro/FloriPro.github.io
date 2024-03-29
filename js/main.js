toBooleanTrue = function (input) {
    if (input == null) { return true; }
    return String(input).toLowerCase() === true.toString();
}; toBoolean = function (input) {
    if (input == null) { return false; }
    return String(input).toLowerCase() === true.toString();
};
function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}


//Fade out Messages
function moveAwayEffect(moveAwayTarget) {
    var moveAwayTargetStyleMarginTopI = 0
    moveAwayTarget.style.marginTop = "0px";
    var moveAwayEffect = setInterval(function () {
        var startHeight = moveAwayTarget.getBoundingClientRect().height
        if (moveAwayTargetStyleMarginTopI < 22) {
            moveAwayTarget.style.padding = (20 - moveAwayTargetStyleMarginTopI) + "px";
            moveAwayTarget.style.height = (20 - (moveAwayTargetStyleMarginTopI / (20 / startHeight))) + "px";
            moveAwayTarget.style.fontSize = (20 - moveAwayTargetStyleMarginTopI) + "px";
            moveAwayTarget.getElementsByClassName("closebtn")[0].style.fontSize = (20 - moveAwayTargetStyleMarginTopI) + "px";
            moveAwayTargetStyleMarginTopI += 1;
        } else {
            clearInterval(moveAwayEffect);
            moveAwayTarget.remove();
        }
    }, 8);
}

function addMessage(text) {
    document.getElementById("alerts").innerHTML += '<div class="alert" style="margin-top: 0;"><span class="closebtn" onclick="moveAwayEffect(this.parentElement)">X </span>' + text + '<br></div>'
}

//smooth movement
$(document).on('click', 'a[href^="#"]', function (event) {
    var el = $.attr(this, 'href').replace("#", "");
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
    if (el != "top") { fadeOut(el); }
});
urlParams = new URLSearchParams(window.location.search);

function loadJS(url, location) {
    var scriptTag = document.createElement('script');
    scriptTag.className = "external";
    scriptTag.src = url;

    location.appendChild(scriptTag);
};

function loadStyle(src) {
    return new Promise(function (resolve, reject) {
        let link = document.createElement('link');
        link.href = src;
        link.className = "external";
        link.rel = 'stylesheet';

        link.onload = () => resolve(link);
        link.onerror = () => reject(new Error(`Style load error for ${src}`));

        document.head.append(link);
    });
}

function fadeOut(el) {
    var ele = document.getElementById(el);
    var blinkcooldown = 0;

    var blinkWait = setInterval(function () {
        blinkcooldown += 1;
        if (blinkcooldown == 1) {
            ele.style.backgroundColor = "rgb(0, 120, 215)"; //0078d7
        }
        if (blinkcooldown >= 10) {
            ele.style.backgroundColor = "rgba(0, 0, 0, 0)";
            clearInterval(blinkWait);
        }
    }, 50);
}


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

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}



window.addEventListener('load', function loadingFinished() {
    if (getCookie("hasAccepted")) {
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
    }
});


function removeElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}


function changePage(pageName) {
    loadNavBarAndMore(pageName);
}


function loadJsAndStyleAsync(Text) {
    for (x in Text["javaScriptFiles"]) {
        loadJS(Text["javaScriptFiles"][x], document.body)
    }
    for (x in Text["javaScriptFiles"]) {
        loadStyle(window.location.origin + Text["stylesheetFiles"][x]);
    }
}
function loadNavBarAndMoreJsonInput(json, pageName) {
    clearBoxClass("topnav");
    clearBoxClass("topnav2");
    clearBox("Text");


    //Pages
    var pages = json;
    for (x in pages) {
        if (x != "404") {
            page = x;
            pageLink = page;

            //generate "a"
            addPageLink = document.createElement('a');

            addPageLinkText = document.createTextNode(page);
            addPageLink.appendChild(addPageLinkText);

            addPageLink.title = page;
            addPageLink.href = "javascript:changePage('" + pageLink + "')";
            document.getElementsByClassName("topnav")[0].appendChild(addPageLink);

            //<a href="/">Home</a>
        }
    }

    //sub Pages
    //var name = window.location.pathname
    var name = pageName;
    //if (name == "/") { name = "Home"; }
    //name = name.replace("/", "").replace("/", "");
    var SubPageElements = json[name]
    if (json[name]["type"] == "text" || json[name]["type"] == "multiHtml") {
        for (x in SubPageElements) {
            if (x != "type" && x != "js") {
                SubPageElement = x;

                //generate "a"
                addPageLink = document.createElement('a');

                addPageLinkText = document.createTextNode(SubPageElement);
                addPageLink.appendChild(addPageLinkText);

                addPageLink.title = SubPageElement;
                addPageLink.href = "#" + SubPageElement.replace(" ", "");
                document.getElementsByClassName("topnav2")[0].appendChild(addPageLink);
            }
        }
    }

    removeElementsByClass("external");

    //Text/Headline for Page
    var t = document.getElementById("Text");
    var Text = json[name]


    var notDel = []
    //search_params.forEach(function (value, key) { console.log(key + ": " + value) });

    if (Text["type"] == "js") {
        eval(Text["javascript"]);
    } else if (Text["type"] == "html") {
        notDel = Text["SearchParams"];
        t.innerHTML += Text["html"]
        setTimeout(loadJsAndStyleAsync, 10, Text);
    } else if (Text["type"] == "text" || Text["type"] == "multiHtml") {

        for (x in Text) {
            if (x != "type") {
                if (Text["type"] != "multiHtml") {
                    t.innerHTML += '<h2 id="' + x.replace(" ", "") + '">' + x + "</h2>";
                    t.innerHTML += '<p>' + Text[x] + "</p>";
                    t.innerHTML += '<p style="padding-bottom: 5%;"></p>';
                } else {
                    if (x != "js") {
                        t.innerHTML += '<h2 id="' + x.replace(" ", "") + '">' + x + "</h2>";
                        t.innerHTML += Text[x]
                        t.innerHTML += '<p style="padding-bottom: 5%;"></p>';
                    }
                    if (x == "js") {
                        eval(Text["js"]);
                    }
                }
            }
        }
    }


    //change url
    url = new URL(window.location.href);
    for (var x = 0; x < 10; x++) {
        var search_params = url.searchParams;
        search_params.forEach(function (value, key) {
            if (!(notDel.includes(key))) {
                search_params.delete(key);
            }
        });
    }
    search_params.set('page', pageName);
    url.search = search_params.toString();
    let newUrlIS = url.toString();
    history.pushState({}, null, newUrlIS);
}


function loadNavBarAndMore(pageName) {

    setCookie("washere", "true", 0.1);
    document.title = "FloriPro | " + pageName;
    if (localStorage["jsonData"] == undefined || toBoolean(getCookie("noCache"))) {
        var ts = new Date().getTime();
        var data = { _: ts };
        $.getJSON("/navigation.json", data, function (json) {

            if (pageName in json) {
                loadNavBarAndMoreJsonInput(json, pageName);
            } else {
                loadNavBarAndMoreJsonInput(json, "404");
            }
            console.log("Saving");
            localStorage.setItem('jsonData', JSON.stringify(json));
        });
    } else {
        var json = JSON.parse(localStorage.getItem('jsonData'));
        if (pageName in json) {
            setTimeout(loadNavBarAndMoreJsonInput, 100, json, pageName);
        } else {
            setTimeout(loadNavBarAndMoreJsonInput, 100, json, "404");
        }
    }
}


function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

function clearBoxClass(elementClass) {
    document.getElementsByClassName(elementClass)[0].innerHTML = "";
}

function delData() {
    localStorage.removeItem("jsonData");
    location.reload(true);
}

function moveTo(link) {
    console.log(link)
    window.location = link;
}

var mouseX = 0;
var mouseY = 0;
onmousemove = function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

if (toBooleanTrue(getCookie("contextMenu"))) {
    if (document.addEventListener) {
        document.addEventListener('contextmenu', function (e) {
            document.getElementById('qrCode').style.display = 'none';
            openMenu();
            e.preventDefault();
        }, false);
    } else {
        document.attachEvent('oncontextmenu', function () {
            document.getElementById('qrCode').style.display = 'none';
            openMenu();
            window.event.returnValue = false;
        });
    }
}


$(document).bind("mousedown", function (event) {
    if (!mouseOnDropdown) {
        document.getElementById("rightClickMenu").style.display = "none";
    }
});

pass = false;

$(document).bind("click", function (event) {
    if (pass != true) {
        document.getElementById("rightClickMenu").style.display = "none";
    } else { pass = false; }
});


function copy(text) {
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

//functions
function copyTextToClipboard() {
    document.getElementById("rightClickMenu").style.display = "none";
    if (linkImg != "") {
        console.log("copy");
        copyElementToClipboard(linkImg);
        linkImg = "";
    } else if (exactText != "" || linkText != "") {
        if (linkText != "") {
            exactText = linkText;
            linkText = "";
        }
        copy(exactText);

    }
}

function openLinkInNewTab() {
    if (linkText.startsWith("javascript:changePage('")) {
        window.open(location.origin + "/?page=" + linkText.replace("javascript:changePage('", "").replace("')", ""), '_blank').focus();
    } else {
        window.open(linkText, '_blank').focus();
    }
}

function selectAll() {
    var sel = window.getSelection();
    var body = document.querySelector("body");
    // Place the children in an array so that we can use the filter method
    var children = Array.prototype.slice.call(body.children);

    // Create the selectable div
    var selectable = document.createElement("div");

    // Style the selectable div so that it doesn't break the flow of a website.

    selectable.style.width = '100%';
    selectable.style.height = '100%';
    selectable.margin = 0;
    selectable.padding = 0;
    selectable.position = 'absolute';

    // Add the selectable element to the body
    body.appendChild(selectable);

    // Filter the children so that we only move what we want to select.
    children = children.filter(function (e) {
        var s = getComputedStyle(e);
        return s.getPropertyValue('user-select') != 'none' && e.tagName != 'SCRIPT'
    });
    // Add each child to the selectable div
    for (var i = 0; i < children.length; i++) {
        selectable.appendChild(children[i]);
    }

    // Select the children of the selectable div
    sel.selectAllChildren(selectable);

}


async function copyElementToClipboard(element) {
    var imageElem = element;
    var range = document.createRange();
    range.selectNode(imageElem);
    window.getSelection().addRange(range);
    try { var successful = document.execCommand('copy'); var msg = successful ? 'successful' : 'unsuccessful'; } catch (err) { console.log('Oops, unable to copy'); }
    window.getSelection().removeAllRanges();
}

function copyLinkToClipboard() {
    if (linkText != "") {
        copy(linkText)
        linkText = ""
    }
}

function addMsg() {

}

var exactText = "";
var linkText = "";
var linkImg = "";
document.addEventListener('mouseup', event => {
    exactText = window.getSelection().toString();
});

var mouseOnDropdown = false;

function mouseStatus(n) {
    mouseOnDropdown = n;
}

function openMenu() {
    document.getElementById("rightClickMenu").style.top = mouseY + "px";
    document.getElementById("rightClickMenu").style.left = mouseX + "px";
    document.getElementById("rightClickMenu").style.display = "unset";
    if (exactText == "" && $("a:hover").length == 0 && $("img:hover").length == 0) { document.getElementById("copyTextToClipboard").style.display = "none"; } else { document.getElementById("copyTextToClipboard").style.display = ""; }

    if ($("a:hover").length != 0) {
        linkText = $("a:hover")[0].href;
        document.getElementById("openLinkInNewTab").style.display = "";
    } else { document.getElementById("openLinkInNewTab").style.display = "none"; }
    if ($("img:hover").length != 0) {
        linkImg = $("img:hover")[0];
    }
}


function back() {
    function back2() {
        if (urlParams.get("page") != null) { loadNavBarAndMore(urlParams.get("page")); }
    }
    history.back();
    setTimeout(back2, 5);
}

window.addEventListener('message', event => {
    // IMPORTANT: check the origin of the data!
    if (event.origin.startsWith('http://localhost')) {
        if (getCookie("allowMessaging") == "true") {
            // The data was sent from your site.
            // Data sent with postMessage is stored in event.data:
            eval(event.data)
        } else {
            alert("sending is not activated");
        }
        return;
    } else {
        alert("sending is not activated: " + event.origin);
        // The data was NOT sent from your site!
        // Be careful! Do not use it. This else branch is
        // here just for clarity, you usually shouldn't need it.
        return;
    }
});