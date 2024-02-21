import { decrypt, encrypt } from "./encryption.js";

// This allows the use of a 'user' type in this script
/**
 * @typedef {object} user A user stored in local storage
 * @property {string} email The users email address
 * @property {string} password The users password stored as an encrypted string
 */

/** @type HTMLFormElement */
const form = document.getElementsByClassName("login-form")[0];

form.onsubmit = async (ev) => {
	// Checks if we should log in or register by checking if the 'geef wachtwoord opnieuw' input is presents
	if (ev.target[2].id === "login-password-verify")
		register(ev.target[0], ev.target[1], ev.target[2]);
	else login(ev.target[0], ev.target[1]);
};

/**
 *
 * @param {HTMLInputElement} emailElem The input for the users email
 * @param {HTMLInputElement} passElem The input element for the users password
 * @param {HTMLInputElement} verifyPassElem The input element for the user to verify their password
 * @returns {false | void}
 */
async function register(emailElem, passElem, verifyPassElem) {
	const email = emailElem.value;
	const password = passElem.value;
	const passwordVerified = verifyPassElem.value;

	if (findLocalUser(email) !== null) {
		const loginLink = document.getElementById("login-link");
		loginLink.classList.remove("highlight");
		setTimeout(() => loginLink.classList.add("highlight"), 10);

		return setValidity(emailElem, "Account bestaat al!");
	}

	if (password !== passwordVerified)
		return setValidity(verifyPassElem, "Wachtwoord komt niet overeen");

	const user = {
		email: email,
		password: await encrypt(password),
	};

	registerUser(user);
	console.log("User added to local storage");
}

async function login(emailElem, passElem) {
	const email = emailElem.value;
	const password = passElem.value;

	const user = findLocalUser(email);
	if (user === null) return setValidity(emailElem, "Account bestaat niet");

	const _password = await decrypt(user.password);
	if (!_password || password !== _password)
		return setValidity(passElem, "Onjuist wachtwoord");

	console.log(`Welcome ${user.email}!`);
}

// ========================= Helper functions =========================

/**
 * This function shows an invalid message on a form element that goes away on a user input (like typing a new character)
 * @param {HTMLElement} target The element to set the validity of
 * @param {string} msg What to set the invalid message to
 * @returns {false} Always return false (EventListeners usually return false when cancelled, so you can just return this)
 */
function setValidity(target, msg) {
	// Set the message
	target.setCustomValidity(msg);
	// Shows the message
	target.reportValidity();
	// This resets the Validity when you type
	target.oninput = async (_ev) => {
		target.setCustomValidity("");
		target.reportValidity();
		// Remove this EventListener from the target when msg cleared
		target.oninput = null;
	};

	// Makes it easy to return false when called
	return false;
}

/**
 * Tries to get a user from local storage
 * @param {string} email The email of the user to look for
 * @returns The user object if found, null otherwise
 */
function findLocalUser(email) {
	/** @type user[] */
	const users = JSON.parse(localStorage.getItem("users")) ?? [];
	return users.find((u) => u.email === email) ?? null;
}

/**
 * Adds a user to local space
 * @param {user} user The user to add
 */
function registerUser(user) {
	/** @type user[] */
	const users = JSON.parse(localStorage.getItem("users")) ?? [];
	users.push(user);

	localStorage.setItem("users", JSON.stringify(users));
}
