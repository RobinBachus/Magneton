// ---- Main ----
let failed = [];
failed.push(setupBuddy() ? null : "Buddy");
failed.push(setupDarkMode() ? null : "Dark Mode");
failed.push(setup404() ? null : "404 Page");
failed.push(setupCookieBanner() ? null : "Cookie Banner");
failed.push(setupAudioSettings() ? null : "Audio Settings");

failed = failed.filter((x) => x);
if (failed.length) {
	console.error("Failed to setup:", failed.join(", "));
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
	/** @type HTMLElement */
	const musicSlashIcon = document.getElementById("music-muted-slash");

	/** @type HTMLButtonElement */
	const muteSfx = document.getElementById("mute-sfx");
	/** @type HTMLElement */
	const sfxIcon = muteSfx.querySelector("i");

	if (!muteMusic || !muteSfx) return false;

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
	return true;
}
