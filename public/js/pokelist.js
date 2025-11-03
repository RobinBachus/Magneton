// ================ Imports ================

import * as types from "./types.js";
import { playAudio, fetchPokemonPage } from "./common.js";

// ================ Type Definitions ================

/** @typedef {types.Pokemon} Pokemon */
/** @typedef {types.Generation} Generation */

// ================ Constants ================

const bgm = new Audio("/assets/audio/pokedexloop.mp3");

// ================ URL Params ================

const path = window.location.pathname.split("/");
const genFull = path[2];
const pokemonId = parseInt(path[3]);

// ================ HTML elements ================

/** @type HTMLElement */
const title = document.getElementById("title");
/** @type HTMLElement */
const pokeList = document.getElementById("pokemon-images");
/** @type HTMLElement */
const loadingScreen = document.getElementById("loading-screen");
/** @type HTMLElement */
const selectedId = document.getElementById("pokemon-id");
/** @type HTMLElement */
const selectedName = document.getElementById("pokemon-name");
/** @type HTMLCollectionOf<HTMLImageElement> */
const selectedTypes = document.getElementsByClassName("type");
const selectedPrimaryType = selectedTypes[0];
const selectedSecondaryType = selectedTypes[1];

/** @type HTMLElement */
const selectedImageContainer = document.getElementById(
	"pokemon-image-container"
);
/** @type HTMLImageElement */
const selectedImage = document.getElementById("pokemon-image");
/** @type HTMLCollectionOf<HTMLElement> */
const selectedStats = document.getElementsByClassName("stat-value");

// ================ Main ================

main();

async function main() {
	playAudio(bgm, true, true, true);

	title.textContent = `Generation ${genFull[3]}`;

	const searchedPokemon = await fetch(`/api/getPokemon/${pokemonId}`);
	setPokemon(await searchedPokemon.json());

	const genLimits = await fetch(`/api/getGenLimits/${genFull}`);
	/** @type Generation */
	const gen = await genLimits.json();

	pokeList.classList.add("loading");
	loadingScreen.classList.remove("hidden");

	const steps = 5;
	for (let i = gen.start; i <= gen.end; i += steps) {
		const page = await fetchPokemonPage(steps, i);
		page.results = page.results.filter(
			(p) => p.id >= gen.start && p.id <= gen.end
		);

		const articles = page.results.map((p) =>
			pokemonToArticle(p, p.id === +selectedId.textContent)
		);
		pokeList.append(...articles);
	}

	loadingScreen.classList.add("hidden");
	pokeList.classList.remove("loading");
}

// ================ Functions ================

/**
 * Converts a Pokemon object to an article element
 * @param {Pokemon} pokemon The Pokemon to convert
 * @param {boolean} selected Whether the Pokemon is selected
 * @returns {HTMLArticleElement} The article element
 */
function pokemonToArticle(pokemon, selected) {
	const article = document.createElement("article");
	article.classList.add("pokecontainer");
	if (selected) article.classList.add("selected");
	article.onclick = () => selectPokemon(pokemon, article);

	const img = document.createElement("img");
	img.classList.add("pokemon");
	img.src = pokemon.icon;
	img.alt = pokemon.name;
	img.height = 128;
	img.width = 128;

	article.appendChild(img);
	return article;
}

/**
 * Selects a Pokemon
 * @param {Pokemon} pokemon The Pokemon to select
 * @param {HTMLElement} article The article element of the Pokemon
 */
function selectPokemon(pokemon, article) {
	setPokemon(pokemon);

	const selected = document.querySelector(".selected");
	if (selected) selected.classList.remove("selected");

	article.classList.add("selected");
}

/**
 * Sets the current Pokemon
 * @param {Pokemon} pokemon The current Pokemon
 */
function setPokemon(pokemon) {
	selectedId.textContent = pokemon.id;
	selectedName.textContent = pokemon.name;
	selectedPrimaryType.src = `/assets/img/${pokemon.types[0]}.png`;
	selectedPrimaryType.alt = pokemon.types[0];
	if (pokemon.types.length > 1)
		selectedSecondaryType.src = `/assets/img/${pokemon.types[1]}.png`;
	else selectedSecondaryType.src = "";
	selectedSecondaryType.alt = pokemon.types[1] ?? "";
	selectedImage.src = pokemon.sprite;
	selectedImage.alt = pokemon.name;
	selectedImageContainer.classList.value = `pixelated bg-${pokemon.types[0]}`;

	const stats = Object.values(pokemon.stats);
	for (let i = 0; i < stats.length; i++) {
		selectedStats[i].textContent = stats[i];
	}
}

export {};
