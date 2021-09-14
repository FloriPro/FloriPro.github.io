//smooth movement
$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});

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


function footerRezise() {
    if (document.getElementById('body').scrollHeight > document.getElementById('body').clientHeight) {
        document.getElementById("footer").style.position = "static";
        document.getElementById("footer").style.lineHeight = "50px";

    } else {
        document.getElementById("footer").style.position = "fixed";
        document.getElementById("footer").style.lineHeight = "20px";
    }
}


//make footerRezise
window.addEventListener('resize', function () {
    footerRezise()
})
window.addEventListener('load', function () {
    loadNavBarAndMore();
})


function removeElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}




function loadNavBarAndMore() {
    $.getJSON("/navigation.json", function (json) {


        //Pages
        var pages = json.pages;
        for (x in pages) {
            page = pages[x];
            pageLink = page;
            if (page == "Home") { pageLink = ""; }

            //generate "a"
            addPageLink = document.createElement('a');

            addPageLinkText = document.createTextNode(page);
            addPageLink.appendChild(addPageLinkText);

            addPageLink.title = page;
            addPageLink.href = "/" + pageLink;
            document.getElementsByClassName("topnav")[0].appendChild(addPageLink);

            //<a href="/">Home</a>
        }


        //sub Pages
        var name = window.location.pathname
        if (name == "/") { name = "Home"; }
        name = name.replace("/", "").replace("/", "");
        var SubPageElements = json.elements[name]
        for (x in SubPageElements) {
            SubPageElement = SubPageElements[x];

            //generate "a"
            addPageLink = document.createElement('a');

            addPageLinkText = document.createTextNode(SubPageElement);
            addPageLink.appendChild(addPageLinkText);

            addPageLink.title = SubPageElement;
            addPageLink.href = "#" + SubPageElement;
            document.getElementsByClassName("topnav2")[0].appendChild(addPageLink);
        }

        //Text/Headline for Page
        var t = document.getElementById("Text");
        var Text = json.Text[name]
        for (x in Text) {
            t.innerHTML += '<h2 id="' + x + '">' + x + "</h2>";
            t.innerHTML += '<p>' + Text[x] + "</p>";
            t.innerHTML += '<p style="padding-bottom: 5%;"></p>';
        }
        footerRezise()
    });
}