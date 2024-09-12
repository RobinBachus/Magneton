const urlAPI = "https://pokeapi.co/api/v2/pokemon/";
const minMysteryId = 10001;
const maxMysteryId = 10277;
const shinyOdds = 20;
const maxPokeId = 1025;

// ================ Audio files ================

const mysteryBGM = new Audio("../assets/audio/wildmystery.mp3");

const Sparkle = new Audio("../assets/audio/Sparkle.mp3");
const runSound = new Audio("../assets/audio/Battle flee.ogg");
const fightSound = new Audio("../assets/audio/Select .ogg");
const itemsSound = new Audio("../assets/audio/pokeball menu.ogg");
const hoverSound = new Audio("../assets/audio/Hover se.ogg");

// ================ HTML elements ================

/** @type HTMLButtonElement */
const runButton = document.getElementById("run");
/** @type HTMLButtonElement */
const fightButton = document.getElementById("fight");
/** @type HTMLButtonElement */
const itemsButton = document.getElementById("items");

const mysteryNameElement = document.getElementById(`enemyname`);
const announcementName = document.getElementById("announcement");

/** @type HTMLImageElement */
const mysteryImage = document.getElementById(`enemyfighter`);

// ================ Main ================

main();

async function main() {
	const pokemons = [];

	// Get first random Pokemon and roll for shiny status
	const pokemon1 = await getRandomPokemon();
	// Get second random Pokemon and roll for shiny status
	const pokemon2 = await getRandomPokemon();
	pokemon2.shinyCheck = await shinyRoller();

	// Check if any of the Pokemon are null
	if (pokemons.includes(null)) {
		console.error("Error fetching Pokemon data");
		return;
	}

	if (mysteryNameElement) {
		// Play the mystery BGM
		await playAudio(mysteryBGM, true, true);
		// Update the mystery Pokemon
		await updateMysteryPokemon();
		// No need to do stats for the mystery battler
		return;
	}

	// Loop through each Pokemon in the array
	for (let index = 0; index <= pokemons.length; index++) {
		const numericIndex = index + 1;

		// Ensure 'pokemon' is defined and accessible
		const pokemon = pokemons[index];
		// Get the nameElement using document.getElementById
		const nameElement = getPlayerNameElement(numericIndex);

		if (nameElement) nameElement.innerText = pokemon.name;

		// Log Pokemon details
		console.log(pokemon.name, pokemon.id);

		let statArray = [
			`healthPlayer${numericIndex}`,
			`attackPlayer${numericIndex}`,
			`defensePlayer${numericIndex}`,
			`special-attackPlayer${numericIndex}`,
			`special-defensePlayer${numericIndex}`,
			`speedPlayer${numericIndex}`,
		];

		for (let i = 0; i < statArray.length; i++) {
			const stat = pokemons[index].stats[i];
			// Abs removes the negative sign (ie. abs(-1) -> 1)
			const otherStat = pokemons[Math.abs(index - 1)].stats[i];

			const statElement = document.getElementById(statArray[i]);
			statElement.style.width = stat.base_stat + "px";
			statElement.innerText = stat.base_stat;

			let bg;

			if (stat.base_stat < otherStat) bg = "red";
			else if (stat.base_stat === otherStat) bg = "yellow";
			else bg = "green";

			statElement.style.backgroundColor = bg;
			statElement.style.color = "white";
		}
	}
}

async function updateMysteryPokemon() {
	const mysteryPokemon = await getRandomPokemon(minMysteryId, maxMysteryId);
	const name = capitalize(getNameBeforeHyphen(mysteryPokemon.name));

	mysteryNameElement.innerText = name;
	announcementName.innerText = `A wild ${name} Appeared!`;

	mysteryImage.src = mysteryPokemon.sprite;

	if (!mysteryPokemon.shiny) return;

	// Add sparkle effect if the Pokemon is shiny
	mysteryNameElement.innerText = `${name} ✨`;
	playAudio(Sparkle);
}

// ================ Helper functions ================

function capitalize(name) {
	return name.charAt(0).toUpperCase() + name.slice(1);
}
function getNameBeforeHyphen(name) {
	return name.split("-")[0]; // Split by hyphen and take the first part
}

function getPlayerNameElement(index) {
	return document.getElementById(`pokemonNamePlayer${index}`);
}

async function getRandomPokemon(min = 0, max = maxPokeId) {
	try {
		const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
		const url = urlAPI + randomId;
		const response = await fetch(url);
		const pokemon = await response.json();
		return pokemon;
	} catch (error) {
		console.error("Error fetching Pokemon data:", error);
	}
}

/**
 * Plays an audio file
 * @param {HTMLAudioElement} audio The audio file to play
 * @param {boolean} isLoop Whether the audio should loop (default: false)
 * @param {boolean} isMusic Whether the audio is music (default: false)
 * @param {Document | HTMLElement | string} musicSelector The (id of an) element to click to start the music if autoplay failed (default: document)
 * @returns {Promise<void>}
 */
async function playAudio(
	audio,
	isLoop = false,
	isMusic = false,
	musicSelector = document
) {
	const muteMusic = document.cookie.includes("music-mute=true");
	const muteSfx = document.cookie.includes("sfx-mute=true");

	audio.loop = isLoop;

	// Check if the audio element already exists in the DOM
	let exists = false;
	document.querySelectorAll("audio").forEach((audioElement) => {
		if (audioElement.src === audio.src) exists = true;
	});

	// If the audio element doesn't exist, append it to the body so it can be muted and controlled by other scripts
	if (!exists) {
		const elem = document.body.appendChild(audio);
		elem.hidden = true;
		elem.classList.add(isMusic ? "music" : "sfx");
	}

	if (isMusic && muteMusic) {
		musicSelector.addEventListener("click", () =>
			playAudio(audio, isLoop, isMusic)
		);
		return;
	}
	if (!isMusic && muteSfx) return;

	try {
		await audio.play();
	} catch (error) {
		if (error instanceof DOMException) {
			if (!isMusic) return;

			// if the error is due to autoplay restrictions, play the audio on user interaction with the selector
			musicSelector.addEventListener(
				"click",
				() => playAudio(audio, isLoop, isMusic),
				{ once: true }
			);
		} else throw error;
	}
}

// ================ Event listeners ================

runButton.addEventListener("click", () => playAudio(runSound));
fightButton.addEventListener("click", () => playAudio(fightSound));
itemsButton.addEventListener("click", () => playAudio(itemsSound));

runButton.addEventListener("mouseover", () => playAudio(hoverSound));
fightButton.addEventListener("mouseover", () => playAudio(hoverSound));
itemsButton.addEventListener("mouseover", () => playAudio(hoverSound));
