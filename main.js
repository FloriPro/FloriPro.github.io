$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});



function addEditButton() {

    var myDiv = document.getElementById("footer");

    // create the button object and add the text to it
    var button = document.createElement("BUTTON");
    button.innerHTML = "edit (dev)";
    button.className = "designModeEdit";
    button.onclick = designModeToggle;
    myDiv.appendChild(button);


    //<button class="designModeEdit" type="button" onclick="if(document.designMode=='off'){document.designMode = 'on';}else{document.designMode = 'off';}">edit (dev)</button>

}
function footerRezise(){
    if (document.getElementById('body').scrollHeight > document.getElementById('body').clientHeight) {
        console.log('scrollable');
        document.getElementById("footer").style.position = "static";
        document.getElementById("footer").style.lineHeight= "50px";
        
    } else {
        console.log('not');
        document.getElementById("footer").style.position = "fixed";
        document.getElementById("footer").style.lineHeight= "20px";
    }
}



window.addEventListener('resize', function () {
    footerRezise()
})
window.addEventListener('load', function () {
    footerRezise()
})

function designModeToggle() {
    if (document.designMode == 'off') {
        document.designMode = 'on';
    } else {
        removeElementsByClass("designModeEdit");

        let loc = window.location.pathname + "index.html";
        let htmlData = document.documentElement.innerHTML;
        document.designMode = 'off';
        $.ajax({
            url: "http://localhost:8080/edithtml",
            method: "post",
            data: { html: htmlData, file: loc }
        });
        addEditButton();
    }
}

function removeElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}