// Description: Common functions and variables used across multiple scripts

// ============== Types ==============

/** @typedef {import('./types.js').Pokemon} Pokemon */
/** @typedef {import('./types.js').Page} Page */

// ============== Constants ==============

export const maxPokeId = 1025;

// ============== Elements ==============

/** @type HTMLButtonElement */
const muteMusicButton = document.getElementById("mute-music");
/** @type HTMLButtonElement */
const muteSfxButton = document.getElementById("mute-sfx");

// ============== Functions ==============

/**
 * Plays an audio file
 * @param {HTMLAudioElement} audio The audio file to play
 * @param {boolean} isLoop Whether the audio should loop (default: false)
 * @param {boolean} isMusic Whether the audio is music (default: false)
 * @param {boolean} waitForUserInteraction Whether to wait for user interaction to play the audio (default: false)
 * @param {HTMLElement | string} selector The (id of the) element to click to play the audio if playback failed on call (default: document)
 * @returns {Promise<void>}
 */
export async function playAudio(
	audio,
	isLoop = false,
	isMusic = false,
	waitForUserInteraction = false,
	selector = document
) {
	const muteMusic = document.cookie.includes("music-mute=true");
	const muteSfx = document.cookie.includes("sfx-mute=true");

	audio.loop = isLoop;

	// Check if the audio element already exists in the DOM
	let exists = false;
	document.querySelectorAll("audio").forEach((audioElement) => {
		if (audioElement.src === audio.src) exists = true;
	});

	// If the audio element doesn't exist, append it to the body so it can be muted and controlled by other scripts
	if (!exists) {
		const elem = document.body.appendChild(audio);
		elem.hidden = true;
		elem.classList.add(isMusic ? "music" : "sfx");
	}

	if (isMusic && muteMusic) {
		muteMusicButton.addEventListener("click", () => {
			playAudio(audio, isLoop, isMusic);
			muteMusicButton.removeEventListener("click", () => {});
		});

		audio.muted = true;
		return;
	}

	if (!isMusic && muteSfx) return;

	try {
		if (!isMusic) audio.currentTime = 0; // Reset the audio if it's an effect
		await audio.play();
	} catch (error) {
		if (error instanceof DOMException) {
			if (!waitForUserInteraction) return;

			// if the error is due to autoplay restrictions, play the audio on user interaction with the selector
			selector.addEventListener(
				"click",
				() => playAudio(audio, isLoop, isMusic),
				{ once: true }
			);
		} else throw error;
	}
}

/**
 * Fetches a random Pokemon from the backend
 * @param {number} min The minimum Pokemon ID to fetch (default: 0)
 * @param {number} max The maximum Pokemon ID to fetch (default: maxPokeId = 1025)
 * @returns {Promise<Pokemon>}
 */
export async function getRandomPokemon(min = 0, max = maxPokeId) {
	try {
		const response = await fetch("/api/getRandomPokemon", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ min, max }),
		});

		const pokemon = await response.json();
		return pokemon;
	} catch (error) {
		console.error("Error fetching Pokemon data:", error);
	}
}

/**
 * Fetches a page of Pokemon from the backend
 * @param {number} limit The number of Pokemon to fetch
 * @param {number} start The number of Pokemon to skip
 * @returns {Promise<Page>}
 */
export async function fetchPokemonPage(limit, start) {
	try {
		const response = await fetch(
			`/api/getPokemonPage?limit=${limit}&start=${start}`
		);
		const page = await response.json();
		return page;
	} catch (error) {
		console.error("Error fetching Pokemon data:", error);
	}
}

/**
 * Formats a Pokemon name
 * @param {Pokemon} pokemon The Pokemon to format
 * @returns {string} The formatted name
 * @example
 * formatPokemonName("bulbasaur") // => "Bulbasaur"
 * formatPokemonName("deoxys-attack") // => "Deoxys" (Removes the form)
 * formatPokemonName("mr-mime") // => "Mr Mime"
 */
export function getFormattedPokemonName(pokemon) {
	let name = pokemon.species;

	if (pokemon.id > maxPokeId) {
		const form = pokemon.name.replace(`${name}-`, "");
		name = `${name}(${form})`;
	}

	return capitalizeAllWords(name).replace("-", " ").trim();
}

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} str The string to capitalize
 * @returns {string} The capitalized string
 */
export function capitalizeAllWords(str) {
	const words = str.split(" ");
	return words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
