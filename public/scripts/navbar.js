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
    document.getElementById("slider").style.right = "-350px";


}


const toggleNavBar = () => {
    if(isNavbarOpen) {
        closeNavbar();
    }
    else {
        openNavbar();
    }

}



document.getElementById("screen").style.display = "none";
console.log("running?");

document.getElementById("accountBtn").addEventListener("click", toggleNavBar);
document.getElementById("screen").addEventListener("click", closeNavbar);
