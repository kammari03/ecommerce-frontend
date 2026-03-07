const hamburger = document.querySelector(".Hambg");
const navigationbar = document.querySelector(".nav-bar");

hamburger.addEventListener("click", ()=>{
    navigationbar.classList.toggle("active");
});