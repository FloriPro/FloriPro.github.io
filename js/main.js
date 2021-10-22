//smooth movement
$(document).on('click', 'a[href^="#"]', function(event) {
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
    return new Promise(function(resolve, reject) {
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

    var blinkWait = setInterval(function() {
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



window.addEventListener('load', function() {
    if (urlParams.get("page") == null) {
        loadNavBarAndMore("Home")
    } else {
        loadNavBarAndMore(urlParams.get("page"));
    }
})


function removeElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}


function changePage(pageName) {
    loadNavBarAndMore(pageName);
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
                addPageLink.href = "#" + SubPageElement;
                document.getElementsByClassName("topnav2")[0].appendChild(addPageLink);
            }
        }
    }

    removeElementsByClass("external");

    //Text/Headline for Page
    var t = document.getElementById("Text");
    var Text = json[name]


    if (Text["type"] == "js") {
        eval(Text["javascript"]);
    } else if (Text["type"] == "html") {
        t.innerHTML += Text["html"]
        for (x in Text["javaScriptFiles"]) {
            loadJS(Text["javaScriptFiles"][x], document.body)
        }
        for (x in Text["javaScriptFiles"]) {
            loadStyle(window.location.origin + Text["stylesheetFiles"][x]);
        }
    } else if (Text["type"] == "text" || Text["type"] == "multiHtml") {
        for (x in Text) {
            if (x != "type") {
                if (Text["type"] != "multiHtml") {
                    t.innerHTML += '<h2 id="' + x + '">' + x + "</h2>";
                    t.innerHTML += '<p>' + Text[x] + "</p>";
                    t.innerHTML += '<p style="padding-bottom: 5%;"></p>';
                } else {
                    if (x != "js") {
                        t.innerHTML += '<h2 id="' + x + '">' + x + "</h2>";
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
}


function loadNavBarAndMore(pageName) {
    document.title = "FloriPro | " + pageName;
    if (localStorage["jsonData"] == undefined) {
        $.getJSON("/navigation.json", function(json) {
            loadNavBarAndMoreJsonInput(json, pageName);
            console.log("Saving");
            localStorage.setItem('jsonData', JSON.stringify(json));
        });
    } else {
        console.log("fromSave");
        loadNavBarAndMoreJsonInput(JSON.parse(localStorage.getItem('jsonData')), pageName);
    }

    //change url
    if (urlParams.get("page") != pageName) {
        let newUrlIS = window.location.origin + '/?page=' + pageName;
        history.pushState({}, null, newUrlIS);
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
    location.reload();
}

function moveTo(link) {
    console.log(link)
    window.location = link;
}

var mouseX = 0;
var mouseY = 0;
onmousemove = function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

if (document.addEventListener) {
    document.addEventListener('contextmenu', function(e) {
        openMenu();
        e.preventDefault();
    }, false);
} else {
    document.attachEvent('oncontextmenu', function() {
        openMenu();
        window.event.returnValue = false;
    });
}
$(document).bind("mousedown", function(event) {
    if (!mouseOnDropdown) {
        document.getElementById("rightClickMenu").style.display = "none";
    }
});
$(document).bind("click", function(event) {
    document.getElementById("rightClickMenu").style.display = "none";
});

function foo() {}


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
        navigator.clipboard.writeText(exactText).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }
}

function copyElementToClipboard(element) {
    window.getSelection().removeAllRanges();
    let range = document.createRange();
    range.selectNode(typeof element === 'string' ? document.getElementById(elementName) : element);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
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
    }
    if ($("img:hover").length != 0) {
        linkImg = $("img:hover")[0];
    }
}

function back() {
    location.reload();
    history.back();
}