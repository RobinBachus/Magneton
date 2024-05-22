import { Pokemon } from "../@types/pokemon";

const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const BACKUP_URL =
	"https://raw.githubusercontent.com/DennisMortelmans/pokesprites/main/";

const maxPokeId = 1025;
const minMysteryId = 10001;
const maxMysteryId = 10277;
const shinyOdds = 20;

export async function getRandomPokemon(form: boolean = false) {
	const min = form ? minMysteryId : 1;
	const max = form ? maxMysteryId : maxPokeId;

	let pokemon: Pokemon;

	try {
		const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
		const url = `${API_URL}${randomId}`;

		const response = await fetch(url);
		const pokemonData = await response.json();

		return jsonToPokemon(pokemonData, url);
	} catch (error) {
		// TODO: Add after push to main
		console.error("Error fetching Pokemon data:", error);
	}
}

function jsonToPokemon(json: any, url: string): Pokemon {
	const pokemon: Pokemon = {
		id: json.id,
		name: json.name,
		stats: {
			hp: json.stats[0].base_stat,
			attack: json.stats[1].base_stat,
			defense: json.stats[2].base_stat,
			specialAttack: json.stats[3].base_stat,
			specialDefense: json.stats[4].base_stat,
			speed: json.stats[5].base_stat,
		},
		shiny: Math.floor(Math.random() * shinyOdds) === 4,
		url,
		icon: "",
		sprite: "",
		backSprite: "",
	};

	return setImages(pokemon, json);
}

function setImages(pokemon: Pokemon, pokemonData: any) {
	const sprites = pokemonData.sprites;
	const shiny = pokemon.shiny;

	pokemon.icon = getFromBackup("icons", pokemonData.id);
	pokemon.sprite = shiny ? sprites.front_shiny : sprites.front_default;
	if (!pokemon.sprite) {
		pokemon.sprite = getFromBackup(
			shiny ? "front_shiny" : "front",
			pokemonData.id
		);
	}

	pokemon.backSprite = shiny ? sprites.back_shiny : sprites.back_default;
	if (!pokemon.backSprite) {
		pokemon.backSprite = getFromBackup(
			shiny ? "back_shiny" : "back",
			pokemonData.id
		);
	}

	return pokemon;
}

function getFromBackup(
	type: "icons" | "front" | "front_shiny" | "back" | "back_shiny",
	id: number
) {
	return `${BACKUP_URL}${id > 10000 ? "forms" : ""}/${type}/${id}.png`;
}
