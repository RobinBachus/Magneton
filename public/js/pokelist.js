// ================ Imports ================

import * as types from "./types.js";
import { playAudio, fetchPokemonPage } from "./common.js";

// ================ Type Definitions ================

/** @typedef {types.Pokemon} Pokemon */

// ================ Constants ================

const bgm = new Audio("/assets/audio/pokedexloop.mp3");

// ================ HTML elements ================

/** @type HTMLSectionElement */
const pokeList = document.getElementById("pokemon-images");

// ================ Main ================

main();

async function main() {
	playAudio(bgm, true, true, true);
	console.log("Fetching Pokemon data...");
	console.log(await fetchPokemonPage(4, 0));
	console.log(await fetchPokemonPage(10, 1));
	console.log(await fetchPokemonPage(4, 1019));
	console.log(await fetchPokemonPage(4, 1023));
}

export {};
