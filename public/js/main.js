// ---- Main ----
let failed = [];
failed.push(setupSideNav() ? null : "Side Nav");
failed.push(setupBuddy() ? null : "Buddy");
failed.push(setupDarkMode() ? null : "Dark Mode");
failed.push(setup404() ? null : "404 Page");

failed = failed.filter((x) => x);
if (failed.length) {
	console.error("Failed to setup:", failed.join(", "));
}

// ---- Side Nav ----
function setupSideNav() {
	const sideNav = document.getElementById("side-nav");

	if (!sideNav) return false;

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
	return true;
}

// ---- Buddy ----
function setupBuddy() {
	const buddy = document.getElementById("buddy");

	if (!buddy) return false;

	buddy.onclick = () => {
		buddy.classList.toggle("expanded");
		buddy.classList.toggle("no-hd");
	};
	return true;
}

// ---- Dark Mode ----
function setupDarkMode() {
	const btn = document.getElementById("LightButton");
	const img = document.getElementById("logo");

	if (!btn || !img) return false;

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
	return true;
}

// ---- 404 Page ----
function setup404() {
	/** @type HTMLAnchorElement */
	const returnLink = document.getElementById("back");
	if (!returnLink) return false;

	returnLink.href = document.referrer;
	return true;
}
