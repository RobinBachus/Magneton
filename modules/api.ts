import { Pokemon } from "../@types/pokemon";
import { Color } from "./common";
import Logger from "./logger";

import { PokemonClient } from "pokenode-ts";

const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const BACKUP_URL =
	"https://raw.githubusercontent.com/DennisMortelmans/pokesprites/main/";

const maxPokeId = 1025;
const minForm = 10001;
const maxForm = 10277;
const shinyOdds = 20;

interface GenIdLimit {
	start: number;
	end: number;
}

interface GenIdLimits {
	gen1: GenIdLimit;
	gen2: GenIdLimit;
	gen3: GenIdLimit;
	gen4: GenIdLimit;
	gen5: GenIdLimit;
	gen6: GenIdLimit;
	gen7: GenIdLimit;
	gen8: GenIdLimit;
	gen9: GenIdLimit;
}

export const apiLogger = new Logger("API", Color.fg.crimson);

export const genIdLimits: GenIdLimits = {
	gen1: { start: 1, end: 151 },
	gen2: { start: 152, end: 251 },
	gen3: { start: 252, end: 386 },
	gen4: { start: 387, end: 493 },
	gen5: { start: 494, end: 649 },
	gen6: { start: 650, end: 721 },
	gen7: { start: 722, end: 809 },
	gen8: { start: 810, end: 905 },
	gen9: { start: 906, end: 1025 },
};

const client = new PokemonClient();

export async function getRandomPokemon(form: boolean = false) {
	const min = form ? minForm : 1;
	const max = form ? maxForm : maxPokeId;

	const randomId = Math.floor(Math.random() * (max - min + 1)) + min;

	return getPokemon(randomId);
}

export async function getPokemon(id: number | string) {
	try {
		const url = `${API_URL}${id}`;

		const response = await fetch(url);
		const pokemonData = await response.json();

		return jsonToPokemon(pokemonData, url);
	} catch (error) {
		Logger.error(`Failed to get Pokemon by ID: ${error}`, "getPokemonById");
	}

	return null;
}

export async function getPokemonRange(start: number, end: number) {
	const pokemonList: Pokemon[] = [];

	for (let i = start; i < end + 1; i++) {
		const url = `${API_URL}${i}`;
		pokemonList.push(jsonToPokemon(await client.getPokemonById(i), url));
	}

	return pokemonList;
}

export async function getPokemonByGen(gen: keyof GenIdLimits) {
	const { start, end } = genIdLimits[gen];
	return getPokemonRange(start, end);
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
		icon: "", // Is set in the return statement
		sprite: "",
		backSprite: "",
		types: json.types.map((type: any) => type.type.name),
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
	return `${BACKUP_URL}${id > 10000 ? "forms/" : ""}${type}/${id}.png`;
}
