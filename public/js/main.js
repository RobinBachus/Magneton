// ---- Main ----
let failed = [];
failed.push(setupSideNav() ? null : "Side Nav");
failed.push(setupBuddy() ? null : "Buddy");
failed.push(setupDarkMode() ? null : "Dark Mode");
failed.push(setup404() ? null : "404 Page");
failed.push(setupCookieBanner() ? null : "Cookie Banner");

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

// ---- Cookie banner ----

async function setupCookieBanner() {
	if (document.cookie.includes("cookie-consent=accept")) return true;

	const cookieBanner = document.createElement("dialog");
	cookieBanner.id = "cookie-banner";

	const consentForm = document.createElement("form");
	consentForm.innerHTML = `
		<section>
			<h2>Cookie Policy</h2>
			<p>
				We gebruiken cookies om je de beste ervaring te geven op onze website.
			</p>
		</section>
		<section>
			<button value="true" id="cookie-accept">Akkoord</button>
			<button>Weigeren</button>
		</section>
	`;

	consentForm.method = "dialog";

	cookieBanner.appendChild(consentForm);

	consentForm.onsubmit = (ev) => {
		ev.preventDefault();

		if (ev.submitter.id === "cookie-accept") {
			const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 31); // A month (ms * s * m * h * d)
			document.cookie = `cookie-consent=accept; expires=${expires.toUTCString()};`;
		}

		cookieBanner.close();
		cookieBanner.remove();
	};

	setTimeout(() => {
		document.body.appendChild(cookieBanner);
		cookieBanner.showModal();
	}, 1000);

	return true;
}
// ---- Loading screen ----
document.addEventListener("DOMContentLoaded", function () {
	const loadingScreen = document.getElementById("loading-screen");

	// Function to show the loading screen
	function showLoadingScreen() {
		loadingScreen.classList.remove("hidden");
	}

	// Select only the 10 specific links inside the article elements
	const articleLinks = document.querySelectorAll("#pokedex-list article a");

	articleLinks.forEach((link) => {
		link.addEventListener("click", function (event) {
			// Show the loading screen when one of the 10 links is clicked
			showLoadingScreen();
		});
	});

	// Hide loading screen when the page finishes loading
	window.addEventListener("load", function () {
		loadingScreen.classList.add("hidden");
	});
});
