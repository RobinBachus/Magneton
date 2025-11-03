// ================ Imports ================
import * as types from "./types.js";
import {
	playAudio,
	getRandomPokemon,
	getFormattedPokemonName,
} from "./common.js";

// ================ Type Definitions ================
/** @typedef {types.Pokemon} Pokemon */

// ================ Constants ================
const minMysteryId = 10001;
const maxMysteryId = 10277;

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

const mysteryNameElement = document.getElementById(`enemy-name`);
const announcementName = document.getElementById("announcement");

/** @type HTMLImageElement */
const mysteryImage = document.getElementById(`enemyfighter`);

// ================ Main ================

main();

/**
 * Main function to fetch Pokemon data and update the DOM
 * @returns {Promise<void>}
 **/
async function main() {
	/**
	 * Has the 2 pokemon
	 * @type Pokemon[]
	 */
	const pokemons = [
		(await getRandomPokemon()) ?? null,
		(await getRandomPokemon()) ?? null,
	];

	// Check if any of the Pokemon are null
	if (pokemons.includes(null)) {
		console.error("Error fetching Pokemon data");
		return;
	}

	if (mysteryNameElement) {
		// Play the mystery BGM
		await playAudio(mysteryBGM, true, true, true);
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
			if (!statElement) continue;
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
	const name = getFormattedPokemonName(mysteryPokemon);

	mysteryNameElement.innerText = name;
	announcementName.innerText = `A wild ${name} Appeared!`;

	mysteryImage.src = mysteryPokemon.sprite;

	if (!mysteryPokemon.shiny) return;

	// Add sparkle effect if the Pokemon is shiny
	mysteryNameElement.innerText = `${name} ✨`;
	// Play the sparkle sound effect once the user interacts with the page
	playAudio(Sparkle, false, false, true);
}

// ================ Helper functions (check common.js) ================

function getPlayerNameElement(index) {
	return document.getElementById(`pokemonNamePlayer${index}`);
}

// ================ Event listeners ================

runButton.addEventListener("click", () => playAudio(runSound));
fightButton.addEventListener("click", () => playAudio(fightSound));
itemsButton.addEventListener("click", () => playAudio(itemsSound));

runButton.addEventListener("mouseover", () => playAudio(hoverSound));
fightButton.addEventListener("mouseover", () => playAudio(hoverSound));
itemsButton.addEventListener("mouseover", () => playAudio(hoverSound));
