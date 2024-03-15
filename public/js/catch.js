import testPokemon from "../assets/json/test_pokemon.json" assert { type: "json" };

const capture_rate = await (
	await (await fetch(testPokemon.species.url)).json()
).capture_rate;
