const sideBar = document.querySelector('.side-nav-container');
const crossIcon = document.querySelector('.fa-xmark');
const barIcon = document.querySelector('.fa-bars');
const body = document.querySelector('body');

crossIcon.addEventListener('click', () => {
    sideBar.style.display = "none";
    body.style.overflow = "auto";
    barIcon.style.display = "unset";
});

barIcon.addEventListener('click', () => {
    sideBar.style.display = "flex";
    body.style.overflow = "hidden";
    barIcon.style.display = "none";
});