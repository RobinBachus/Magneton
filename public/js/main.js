// ---- Main ----
setupSideNav();
setupDarkMode();
setup404();

// ---- Side Nav ----

function setupSideNav() {
	const sideNav = document.getElementById("side-nav");

	if (!sideNav) return;

	const sAdd = (className) => sideNav.classList.add(className);
	const sRemove = (className) => sideNav.classList.remove(className);

	openNav = () => {
		sRemove("closed");
		sAdd("open");
	};

	closeNav = () => {
		sRemove("open");
		sAdd("closed");
	};

	const openButton = document.getElementById("open-nav");
	const closeButton = document.getElementById("close-nav");
}

// ---- Dark Mode ----
function setupDarkMode() {
	const btn = document.getElementById("LightButton");
	const img = document.getElementById("MnLogo");

	if (!btn || !img) return;

	const imageList = [
		"./assets/img/LogoLightModeNewer.png",
		"./assets/img/LogoDarkModeNewer.png",
	];

	let i = 0;
	btn.onclick = (ev) => {
		document.body.classList.toggle("DarkMode");
		i = ++i % 2;
		img.src = imageList[i];
	};
}

// ---- 404 Page ----
function setup404() {
	/** @type HTMLAnchorElement */
	const returnLink = document.getElementById("back");
	if (!returnLink) return;

	returnLink.href = document.referrer;
}
