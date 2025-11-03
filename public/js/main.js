import { getUser, HTTPStatusText, status } from "./common.js";

const { SUCCESS, FAILED, SKIPPED } = status;

/**
 * Run setup functions for various features
 */
let setupStatus = [
	{
		name: "Buddy",
		status: setupBuddy(),
	},
	{
		name: "Dark Mode",
		status: setupDarkMode(),
	},
	{
		name: "Error Page",
		status: setupErrorPage(),
	},
	{
		name: "Cookie Banner",
		status: setupCookieBanner(),
	},
	{
		name: "Audio Settings",
		status: setupAudioSettings(),
	},
	{
		name: "Avatar",
		status: await setupAvatar(),
	},
];

const failed = setupStatus
	.filter((obj) => obj.status == FAILED)
	.map((obj) => obj.name);

const skipped = setupStatus
	.filter((obj) => obj.status == SKIPPED)
	.map((obj) => obj.name);

if (skipped.length) console.warn("Skipped setup for:", skipped);
if (failed.length) console.error("Failed to setup:", failed);

// ---- Buddy ----
function setupBuddy() {
	const buddy = document.getElementById("buddy");

	if (!buddy) return SKIPPED;

	buddy.onclick = () => {
		buddy.classList.toggle("expanded");
		buddy.classList.toggle("no-hd");
	};
	return SUCCESS;
}

// ---- Dark Mode ----
function setupDarkMode() {
	const btn = document.getElementById("LightButton");
	const img = document.getElementById("logo");

	if (!btn || !img) return SKIPPED;

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
	return SUCCESS;
}

// ---- Error Page ----
function setupErrorPage() {
	const errorTitle = document.getElementById("error-title");
	const errorMsg = document.getElementById("error-msg");

	if (!errorTitle || !errorMsg) return SKIPPED;

	const errorCode = parseInt(window.location.pathname.replace("/error/", ""));

	document.title = `Error ${errorCode}`;
	errorTitle.textContent = `Error ${errorCode}`;

	const searchParams = new URLSearchParams(window.location.search);
	const message = searchParams.get("msg");
	errorMsg.textContent = message || HTTPStatusText[errorCode];

	return SUCCESS;
}

// ---- Cookie banner ----

function setupCookieBanner() {
	if (document.cookie.includes("cookie-consent=accept")) return SUCCESS;

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

	return SUCCESS;
}

// ---- Loading screen ----

// document.addEventListener("DOMContentLoaded", function () {
// 	const loadingScreen = document.getElementById("loading-screen");

// 	// Function to show the loading screen
// 	function showLoadingScreen() {
// 		loadingScreen.classList.remove("hidden");
// 	}

// 	// Select only the 10 specific links inside the article elements
// 	const articleLinks = document.querySelectorAll("#pokedex-list article a");

// 	articleLinks.forEach((link) => {
// 		link.addEventListener("click", function (event) {
// 			// Show the loading screen when one of the 10 links is clicked
// 			showLoadingScreen();
// 		});
// 	});

// 	// Hide loading screen when the page finishes loading
// 	window.addEventListener("load", function () {
// 		if (loadingScreen) loadingScreen.classList.add("hidden");
// 	});
// });

// ---- Audio Settings ----

function setupAudioSettings() {
	/** @type HTMLButtonElement */
	const muteMusic = document.getElementById("mute-music");
	/** @type HTMLButtonElement */
	const muteSfx = document.getElementById("mute-sfx");

	if (!muteMusic || !muteSfx) return SKIPPED;

	/** @type HTMLElement */
	const musicSlashIcon = document.getElementById("music-muted-slash");
	/** @type HTMLElement */
	const sfxIcon = muteSfx.querySelector("i");

	let muted = document.cookie.includes("music-mute=true");
	musicSlashIcon.style.display = muted ? "block" : "none";
	muteMusic.classList.toggle("muted", muted);

	muted = document.cookie.includes("sfx-mute=true");
	sfxIcon.className = muted ? "fas fa-volume-mute" : "fas fa-volume-up";
	muteSfx.classList.toggle("muted", muted);

	muteMusic.onclick = () => {
		const muted = muteMusic.classList.toggle("muted");
		musicSlashIcon.style.display = muted ? "block" : "none";
		document.cookie = `music-mute=${muted}`;

		/** @type HTMLCollectionOf<HTMLAudioElement> */
		const music = document.getElementsByClassName("music");
		for (let song of music) {
			song.muted = muted;
		}
	};

	muteSfx.onclick = () => {
		const muted = muteSfx.classList.toggle("muted");
		sfxIcon.className = muted ? "fas fa-volume-mute" : "fas fa-volume-up";
		document.cookie = `sfx-mute=${muted}`;

		if (muted) {
			/** @type HTMLCollectionOf<HTMLAudioElement> */
			const sfx = document.getElementsByClassName("sfx");
			for (let sound of sfx) sound.pause();
		}
	};
	return SUCCESS;
}

async function setupAvatar() {
	/** @type HTMLImageElement */
	const elemAvatar = document.getElementById("usericon");

	if (!elemAvatar) return SKIPPED;

	try {
		const user = await getUser();
		elemAvatar.src = user.avatar;
		return SUCCESS;
	} catch (e) {
		return FAILED;
	}
}

export {};
