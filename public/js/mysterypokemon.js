const urlAPI = "https://pokeapi.co/api/v2/pokemon/";
const minMysteryId = 10001;
const maxMysteryId = 10277;
const shinyOdds = 4;
const maxPokeId = 1025;

main();
function capitalize(name) {
	return name.charAt(0).toUpperCase() + name.slice(1);
}
function getNameBeforeHyphen(name) {
	return name.split("-")[0]; // Split by hyphen and take the first part
}
async function main() {
	const pokemons = [];

	// Get first random Pokemon and roll for shiny status
	const pokemon1 = await getRandomPokemon();
	// Get second random Pokemon and roll for shiny status
	const pokemon2 = await getRandomPokemon();
	pokemon2.shinyCheck = await shinyRoller();

	// Get random pokemon and roll for shiny status
	const pokemonForm = await getRandomPokemon(minMysteryId, maxMysteryId);
	pokemonForm.shinyCheck = await shinyRoller();

	// Push the Pokemon objects into the array
	pokemons.push(pokemon1);
	pokemons.push(pokemon2);
	// Loop through each Pokemon in the array
	for (let index = 1; index <= pokemons.length; index++) {
		// Ensure 'pokemon' is defined and accessible
		const pokemon = pokemons[index - 1];
		const mysteryPokemon = pokemonForm;
		const Sparkle = new Audio("../assets/audio/Sparkle.mp3");
		// Get the nameElement using document.getElementById
		const nameElement = document.getElementById(
			`pokemonNamePlayer${index}`
		);
		if (nameElement) {
			nameElement.innerText = pokemon.name;
		} else {
			console.error(`Element pokemonNamePlayer${index} not found.`);
		}
		const mysteryNameElement = document.getElementById(`enemyname`);
		if (mysteryNameElement) {
			const formattedName = capitalize(
				getNameBeforeHyphen(mysteryPokemon.name)
			);
			mysteryNameElement.innerText = formattedName;
		}

		// Get the image element using document.getElementById
		const announcementName = document.getElementById("announcement");
		if (announcementName) {
			const formattedNameAnnouncement = capitalize(
				getNameBeforeHyphen(mysteryPokemon.name)
			);
			announcementName.innerText = `A wild ${formattedNameAnnouncement} Appeared!`;
		}
		const mysteryImage = document.getElementById(`enemyfighter`);
		if (mysteryImage) {
			// Check if pokemon is shiny and set the image source accordingly
			if (mysteryPokemon.shinyCheck) {
				const formattedNameShiny = capitalize(
					getNameBeforeHyphen(mysteryPokemon.name)
				);
				mysteryImage.src = mysteryPokemon["sprites"]["front_shiny"];
				mysteryNameElement.innerText = `${formattedNameShiny} ✨`;
				Sparkle.play();
			} else {
				mysteryImage.src = mysteryPokemon["sprites"]["front_default"];
			}
		} else {
			console.error(`Element activePlayer${index} not found.`);
		}

		// Log Pokemon details
		console.log(pokemon.name, pokemon.id);

		let statArray = [];

		// Loop through each stat of the Pokemon
		for (let i = 0; i < pokemon.stats.length; i++) {
			statArray = [
				`healthPlayer${index}`,
				`attackPlayer${index}`,
				`defensePlayer${index}`,
				`special-attackPlayer${index}`,
				`special-defensePlayer${index}`,
				`speedPlayer${index}`,
			];
		}

		for (let i = 0; i < pokemons[0].stats.length; i++) {
			const stat = pokemons[index - 1].stats[i];
			// [+!(index - 1)] is a fancy way of getting the other index
			const otherStat = pokemons[+!(index - 1)].stats[i].base_stat;

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

async function shinyRoller() {
	return Math.floor(Math.random() * shinyOdds) + 1 === 4;
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
const runSound = new Audio("../assets/audio/Battle flee.ogg");
const fightSound = new Audio("../assets/audio/Select .ogg");
const itemsSound = new Audio("../assets/audio/pokeball menu.ogg");
const hoverSound = new Audio("../assets/audio/Hover se.ogg");
const runButton = document.getElementById("run");
const fightButton = document.getElementById("fight");
const itemsButton = document.getElementById("items");

runButton.addEventListener("click", () => {
	runSound.play();
});

fightButton.addEventListener("click", () => {
	fightSound.play();
});

itemsButton.addEventListener("click", () => {
	itemsSound.play();
});
runButton.addEventListener("mouseover", () => {
	hoverSound.play();
});

fightButton.addEventListener("mouseover", () => {
	hoverSound.play();
});

itemsButton.addEventListener("mouseover", () => {
	hoverSound.play();
});
