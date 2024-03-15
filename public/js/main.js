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
