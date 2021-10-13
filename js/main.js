//smooth movement
$(document).on('click', 'a[href^="#"]', function(event) {
    var el = $.attr(this, 'href').replace("#", "");
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
    fadeOut(el);
});

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
    if (window.location.search == "") { loadNavBarAndMore("Home") } else { loadNavBarAndMore(window.location.search.slice(1)); }
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


    //sub Pages
    //var name = window.location.pathname
    var name = pageName;
    //if (name == "/") { name = "Home"; }
    //name = name.replace("/", "").replace("/", "");
    var SubPageElements = json[name]
    if (json[name]["type"] == "text") {
        for (x in SubPageElements) {
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
    } else if (Text["type"] == "text") {
        for (x in Text) {
            if (x != "type") {

                t.innerHTML += '<h2 id="' + x + '">' + x + "</h2>";
                t.innerHTML += '<p>' + Text[x] + "</p>";
                t.innerHTML += '<p style="padding-bottom: 5%;"></p>';
            }
        }
    }
}


function loadNavBarAndMore(pageName) {
    document.title = "FloriPro | " + pageName;
    if (localStorage["jsonData"] == undefined || true) {
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
    let newUrlIS = window.location.origin + '/?' + pageName;
    history.pushState({}, null, newUrlIS);
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