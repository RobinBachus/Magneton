/*Sidenav*/
const sideNav = document.getElementById("side-nav");
const sAdd = (className) => sideNav.classList.add(className);
const sRemove = (className) => sideNav.classList.remove(className);

function openNav() {
	sRemove("closed");
	sAdd("open");
}

function closeNav() {
	sRemove("open");
	sAdd("closed");
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
