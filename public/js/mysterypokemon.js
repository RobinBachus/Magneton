/** @typedef {import('./types').Pokemon} Pokemon */

// ================ Constants ================

const minMysteryId = 10001;
const maxMysteryId = 10277;
const shinyOdds = 4;
const maxPokeId = 1025;

// ================ Audio files ================

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
		await updateMysteryPokemon();
		// No need to do stats for the mystery battler
		return;
	}

	// Loop through each Pokemon in the array
	for (let index = 1; index <= pokemons.length; index++) {
		// Ensure 'pokemon' is defined and accessible
		const pokemon = pokemons[index - 1];
		// Get the nameElement using document.getElementById
		const nameElement = getPlayerNameElement(index);

		if (nameElement) nameElement.innerText = pokemon.name;

		// Log Pokemon details
		console.log(pokemon.name, pokemon.id);

		let statArray = [
			`healthPlayer${index}`,
			`attackPlayer${index}`,
			`defensePlayer${index}`,
			`special-attackPlayer${index}`,
			`special-defensePlayer${index}`,
			`speedPlayer${index}`,
		];

		for (let i = 0; i < statArray.length; i++) {
			const stat = pokemons[index - 1].stats[i];
			// [+!(index - 1)] is a fancy way of getting the other index
			const otherStat = pokemons[+!(index - 1)].stats[i];

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
	const name = capitalize(getNameBeforeHyphen(mysteryPokemon.name));

	mysteryNameElement.innerText = name;
	announcementName.innerText = `A wild ${name} Appeared!`;

	mysteryImage.src = mysteryPokemon.sprite;

	if (!mysteryPokemon.shiny) return;

	// Add sparkle effect if the Pokemon is shiny
	mysteryNameElement.innerText = `${name} ✨`;
	Sparkle.play();
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
		const response = await fetch("/api/getRandomPokemon", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ min, max }),
		});

		/** @type Pokemon */
		const pokemon = await response.json();
		return pokemon;
	} catch (error) {
		console.error("Error fetching Pokemon data:", error);
	}
}

// ================ Event listeners ================

runButton.addEventListener("click", () => runSound.play());
fightButton.addEventListener("click", () => fightSound.play());
itemsButton.addEventListener("click", () => itemsSound.play());

runButton.addEventListener("mouseover", () => hoverSound.play());
fightButton.addEventListener("mouseover", () => hoverSound.play());
itemsButton.addEventListener("mouseover", () => hoverSound.play());
