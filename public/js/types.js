/**
 * This file is used for defining types to be used in the project
 * By doing this we can ensure common data is always stored the same way
 * So far it seems to work without importing
 */

// To use the types, put `/** @type *TYPE_NAME* */` above the variable you want to give a the type to
// See the findLocalUser or registerUser function in the login.js script for an example of the IUser type

/**
 * A user stored in local storage
 *
 * @typedef {object} IUser
 * @property {string} email The users email address
 * @property {string} password The users password stored as an encrypted string
 */

/**
 * A pokemon object
 * @typedef {object} Pokemon
 * @property {number} id The pokemon's id
 * @property {string} name The pokemon's name
 * @property {string} species The pokemon's species
 * @property {Stats} stats The pokemon's stats
 * @property {boolean} shiny Whether the pokemon is shiny
 * @property {string} url The url of the pokemon
 * @property {string} icon The url of the pokemon's icon
 * @property {string} sprite The url of the pokemon's sprite
 * @property {string} backSprite The url of the pokemon's back sprite
 * @property {string[]} types The pokemon's types
 */

/**
 * The stats of a pokemon
 * @typedef {object} Stats
 * @property {number} hp The pokemon's health points
 * @property {number} attack The pokemon's attack points
 * @property {number} defense The pokemon's defense points
 * @property {number} specialAttack The pokemon's special attack points
 * @property {number} specialDefense The pokemon's special defense points
 * @property {number} speed The pokemon's speed points
 */

/**
 * A page of Pokemon
 * @typedef {Object} Page
 * @property {Pokemon[]} results The Pokemon on the page
 * @property {number} limit The number of Pokemon to fetch
 * @property {number} start The first Pokemon on the page
 * @property {string?} next The URL to the next page (if it exists)
 * @property {string?} previous The URL to the previous page (if it exists)
 * @property {number} count The total number of Pokemon
 */

/**
 * Stores the start and end of a generation
 * @typedef {Object} Generation
 * @property {number} start The start of the generation
 * @property {number} end The end of the generation
 */

export const types = {};
