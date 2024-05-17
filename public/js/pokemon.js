const urlAPI = "https://pokeapi.co/api/v2/pokemon/";
const maxPokeId = 1025;
let shinyCheck = false;
const shinyOdds = 10;
main();
async function shinyRoller() {
	const shinyId = Math.floor(Math.random() * shinyOdds) + 1;
	let shinyCheck;
	if (shinyId === 4) {
		shinyCheck = true;
	} else {
		shinyCheck = false;
	}
	console.log("Shiny ID:", shinyId); // Log shinyId for reference
	console.log("Shiny Check Result inside shinyRoller:", shinyCheck); // Log shinyCheck

	return { shinyId, shinyCheck };
}

async function getRandomPokemon() {
	try {
		const randomId = Math.floor(Math.random() * maxPokeId) + 1;
		const url = urlAPI + randomId;
		const response = await fetch(url);
		const pokemon = await response.json();
		return pokemon;
	} catch (error) {
		console.error("Error fetching Pokemon data:", error);
	}
}
async function main() {
	async function main() {
		const pokemons = [];

		// Get first random Pokemon and roll for shiny status
		const pokemon1 = await getRandomPokemon();
		const { shinyCheck: rollerCheck1 } = await shinyRoller();
		pokemon1.shinyCheck = rollerCheck1;

		// Get second random Pokemon and roll for shiny status
		const pokemon2 = await getRandomPokemon();
		const { shinyCheck: rollerCheck2 } = await shinyRoller();
		pokemon2.shinyCheck = rollerCheck2;

		// Push the Pokemon objects into the array
		pokemons.push(pokemon1);
		pokemons.push(pokemon2);

		// Loop through each Pokemon in the array
		for (let index = 1; index <= pokemons.length; index++) {
			// Ensure 'pokemon' is defined and accessible
			const pokemon = pokemons[index - 1];

			// Get the nameElement using document.getElementById
			const nameElement = document.getElementById(
				`pokemonNamePlayer${index}`
			);
			if (nameElement) {
				nameElement.innerText = pokemon.name;
			} else {
				console.error(`Element pokemonNamePlayer${index} not found.`);
			}

			// Get the image element using document.getElementById
			const image = document.getElementById(`activePlayer${index}`);
			if (image) {
				// Check if pokemon is shiny and set the image source accordingly
				if (pokemon.shinyCheck) {
					image.src =
						pokemon.sprites.other["official-artwork"].front_shiny;
				} else {
					image.src =
						pokemon.sprites.other["official-artwork"].front_default;
				}
			} else {
				console.error(`Element activePlayer${index} not found.`);
			}

			// Log Pokemon details
			console.log(pokemon.name, pokemon.id);

			// Loop through each stat of the Pokemon
			for (let i = 0; i < pokemon.stats.length; i++) {
				const stat = pokemon.stats[i];
				const statArray = [
					`healthPlayer${index}`,
					`attackPlayer${index}`,
					`defensePlayer${index}`,
					`special-attackPlayer${index}`,
					`special-defensePlayer${index}`,
					`speedPlayer${index}`,
				];
				const statElement = document.getElementById(statArray[i]);
				statElement.style.width = stat.base_stat + "px";
				statElement.innerText = stat.base_stat;
				if (
					stat.base_stat < pokemons[+!(index - 1)].stats[i].base_stat
				) {
					statElement.style.backgroundColor = "red";
				}
				if (
					stat.base_stat == pokemons[+!(index - 1)].stats[i].base_stat
				) {
					statElement.style.backgroundColor = "orange";
				}
				if (
					stat.base_stat > pokemons[+!(index - 1)].stats[i].base_stat
				) {
					statElement.style.backgroundColor = "green";
				}
				statElement.style.color = "white";
				let width = 1;
				const id = setInterval(frame, 5);
				function frame() {
					if (width >= stat.base_stat) {
						clearInterval(id);
					} else {
						width++;
						statElement.style.width = width + "px";
					}
				}

				// Other stat-related actions
			}
		}

		// Log the updated Pokemon array with shinyCheck applied
		console.log("Pokemons with ShinyCheck:", pokemons);
	}

	// Call the main function to start the process
	main();
	/*Battler */
}
