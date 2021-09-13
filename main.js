$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});

/*function up() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}*/



function addEditButton(){

    var myDiv = document.getElementById("footer");

    // create the button object and add the text to it
    var button = document.createElement("BUTTON");
    button.innerHTML = "edit (dev)";
    button.className="designModeEdit";
    button.onclick = designModeToggle;
    myDiv.appendChild(button);


    //<button class="designModeEdit" type="button" onclick="if(document.designMode=='off'){document.designMode = 'on';}else{document.designMode = 'off';}">edit (dev)</button>

}

window.addEventListener('load', function (){
    if (window.location.hostname=="localhost"){
        addEditButton();
//this.document.getElementsByClassName("designModeEdit")[0].style.display = "block";
    }
})

function designModeToggle() {
    if(document.designMode=='off'){
        document.designMode = 'on';
    }else{
        removeElementsByClass("designModeEdit");

        let loc = window.location.pathname+"index.html";
        let htmlData = document.documentElement.innerHTML;
        document.designMode = 'off';
        $.ajax({
            url: "http://localhost:8080/edithtml",
            method: "post",
            data: { html: htmlData , file:loc}
        });
        addEditButton();
    }
}

function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}