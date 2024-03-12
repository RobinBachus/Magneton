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
