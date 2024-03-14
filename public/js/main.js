/*Sidenav*/
function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
/*Darkmode*/
const btn = document.getElementById("LightButton");
const img = document.getElementById("MnLogo");

const imglist = [
  "./assets/img/LogoLightModeNewer.png",
  "./assets/img/LogoDarkModeNewer.png",
];
let i = 0;
btn.onclick = (ev) => {
  document.body.classList.toggle("DarkMode");
  i = ++i % 2;
  img.src = imglist[i];
};
