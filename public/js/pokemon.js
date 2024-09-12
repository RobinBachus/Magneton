const urlAPI = "https://pokeapi.co/api/v2/pokemon/";
const maxPokeId = 1025;
let pokemons = [];

document.addEventListener("DOMContentLoaded", () => {
	const findme = document.getElementById("findme");
	const dropdown1 = document.getElementById("dropdown1");
	const findme2 = document.getElementById("findme2");
	const dropdown2 = document.getElementById("dropdown2");

	findme.addEventListener("input", (e) => handleInput(e, dropdown1, 1));
	findme2.addEventListener("input", (e) => handleInput(e, dropdown2, 2));

	dropdown1.addEventListener("click", (e) => handleDropdownClick(e, 1));
	dropdown2.addEventListener("click", (e) => handleDropdownClick(e, 2));

	async function handleInput(e, dropdown, player) {
		const searchString = e.target.value.trim().toLowerCase();
		if (searchString.length === 0) {
			dropdown.innerHTML = "";
			dropdown.style.display = "none"; // Hide dropdown if no search string
			return;
		}
		const response = await fetch(
			`https://pokeapi.co/api/v2/pokemon/?limit=1025`
		);
		const data = await response.json();
		const matchingPokemons = data.results
			.filter((pokemon) => pokemon.name.includes(searchString))
			.slice(0, 3);
		dropdown.innerHTML = matchingPokemons
			.map((pokemon) => `<li>${pokemon.name}</li>`)
			.join("");
		dropdown.style.display = matchingPokemons.length ? "block" : "none"; // Show dropdown if there are suggestions, otherwise hide
	}

	async function handleDropdownClick(e, player) {
		const selectedPokemon = e.target.textContent;
		const response = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`
		);
		const data = await response.json();
		pokemons[player - 1] = data; // Store the selected Pokémon data
		displayPokemon(data, player);
		if (pokemons.length === 2 && pokemons[0] && pokemons[1]) {
			compareAndStyleStats();
		}
		const dropdown = player === 1 ? dropdown1 : dropdown2;
		dropdown.style.display = "none"; // Hide dropdown after selection
	}

	function displayPokemon(pokemonData, player) {
		const playerName = document.getElementById(
			`pokemonNamePlayer${player}`
		);
		const activePokemon = document.getElementById(`activePlayer${player}`);
		const pokemonStats = document.getElementById(`pokemon${player}`);

		playerName.textContent = pokemonData.name;
		activePokemon.src =
			pokemonData.sprites.other["official-artwork"].front_default;

		const statsHTML = `
            <li id="hp${player}" class="health-container">
                <abbr title="Health Points">HP</abbr>
                <section style="background-color: transparent;">${pokemonData.stats[0].base_stat}</section>
            </li>
            <li id="attack${player}" class="attack-container">
                <abbr title="Attack">ATK</abbr>
                <section style="background-color: transparent;">${pokemonData.stats[1].base_stat}</section>
            </li>
            <li id="defense${player}" class="defense-container">
                <abbr title="Defense">DEF</abbr>
                <section style="background-color: transparent;">${pokemonData.stats[2].base_stat}</section>
            </li>
            <li id="special-attack${player}" class="special-attack-container">
                <abbr title="Special Attack">SPA</abbr>
                <section style="background-color: transparent;">${pokemonData.stats[3].base_stat}</section>
            </li>
            <li id="special-defense${player}" class="special-defense-container">
                <abbr title="Special Defense">SPD</abbr>
                <section style="background-color: transparent;">${pokemonData.stats[4].base_stat}</section>
            </li>
            <li id="speed${player}" class="speed-container">
                <abbr title="Speed">SPE</abbr>
                <section style="background-color: transparent;">${pokemonData.stats[5].base_stat}</section>
            </li>
        `;
		pokemonStats.innerHTML = statsHTML;
	}

	function compareAndStyleStats() {
		for (let i = 0; i < pokemons[0].stats.length; i++) {
			const stat1 = pokemons[0].stats[i].base_stat;
			const stat2 = pokemons[1].stats[i].base_stat;

			const statElement1 = document
				.getElementById(`${pokemons[0].stats[i].stat.name}1`)
				.querySelector("section");
			const statElement2 = document
				.getElementById(`${pokemons[1].stats[i].stat.name}2`)
				.querySelector("section");

			let bg, bg2;

			if (stat1 < stat2) bg = "red";
			else if (stat1 === stat2) bg = "yellow";
			else bg = "green";
			if (stat1 > stat2) bg2 = "red";
			else if (stat1 === stat2) bg2 = "yellow";
			else bg2 = "green";
			console.log(stat2);

			statElement1.style.width = stat1 / 2.55 + "%";
			statElement1.style.backgroundColor = bg;

			statElement2.style.width = stat2 / 2.55 + "%";
			statElement2.style.backgroundColor = bg2;
		}
	}
});
// pokemonlist
