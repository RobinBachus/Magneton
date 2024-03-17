const urlAPI = "https://pokeapi.co/api/v2/pokemon/";
const maxPokeId = 1026;

main();

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
	const pokemons = [];
	pokemons.push(await getRandomPokemon());
	pokemons.push(await getRandomPokemon());

	for (let index = 1; index <= 2; index++) {
		const pokemon = pokemons[index - 1];
		const nameElement = document.getElementById(
			`pokemonNamePlayer${index}`
		);
		nameElement.innerText = pokemon.name;
		const image = document.getElementById(`activePlayer${index}`);
		image.src = pokemon.sprites.other["home"].front_default;

		console.log(pokemon.name, pokemon.id);
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

			console.log(
				stat.base_stat,
				pokemons[+!(index - 1)].stats[i].base_stat
			);

			if (stat.base_stat < pokemons[+!(index - 1)].stats[i].base_stat) {
				statElement.style.backgroundColor = "red";
			}
			if (stat.base_stat == pokemons[+!(index - 1)].stats[i].base_stat) {
				statElement.style.backgroundColor = "orange";
			}
			if (stat.base_stat > pokemons[+!(index - 1)].stats[i].base_stat) {
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
		}
	}
}
