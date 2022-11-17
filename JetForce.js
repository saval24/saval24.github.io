function about(back){
    if (back == true) {
        document.getElementById("about").style.display = "none"
        document.getElementById("front").style.display = "initial"
        document.getElementById("frontbutton").style.display = "initial"
    }
    else {
        document.getElementById("front").style.display = "none"
        document.getElementById("frontbutton").style.display = "none"
        document.getElementById("about").style.display = "initial"
    }
}

function levels(back){
    if (back ==  true) {
        document.getElementById("frontbutton").style.display = "initial"
        document.getElementById("levels").style.display = "none"
    }
    else {
        document.getElementById("frontbutton").style.display = "none"
        document.getElementById("levels").style.display = "initial"
    }
}