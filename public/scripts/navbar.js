let isNavbarOpen = false;

const openNavbar = () => {
    isNavbarOpen = true;
    console.log("open");
    document.getElementById("screen").style.display = "";
    document.getElementById("slider").style.right = "0px";
}

const closeNavbar = () => {
    isNavbarOpen = false;
    console.log("closed");
    document.getElementById("screen").style.display = "none";
    let w = document.getElementById("slider").offsetWidth;
    console.log(w);
    document.getElementById("slider").style.right = `-${w}px`;


}


const toggleNavBar = () => {
    if(isNavbarOpen) {
        closeNavbar();
    }
    else {
        openNavbar();
    }

}


window.onload = () => {
    try{
        document.getElementById("screen").style.display = "none";
        document.getElementById("accountBtn").addEventListener("click", toggleNavBar);
        document.getElementById("screen").addEventListener("click", closeNavbar);
        closeNavbar();
    } catch(e) {}
}