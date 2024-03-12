import { decrypt, encrypt } from "./encryption.js";

/** @type HTMLFormElement */
const form = document.getElementsByClassName("login-form")[0];

// Runs when you click the submit button
form.onsubmit = async (ev) => {
	// Checks if we should log in or register by checking if the 'geef wachtwoord opnieuw' input is presents
	if (ev.target[2].id === "login-password-verify")
		register(ev.target[0], ev.target[1], ev.target[2]);
	else login(ev.target[0], ev.target[1]);
};

/**
 * Tries to register a new user
 * @param {HTMLInputElement} emailElem The input element for the users email
 * @param {HTMLInputElement} passElem The input element for the users password
 * @param {HTMLInputElement} verifyPassElem The input element for the user to verify their password
 * @returns {false | void} False if cancelled (nothing otherwise)
 */
async function register(emailElem, passElem, verifyPassElem) {
	const email = emailElem.value;
	const password = passElem.value;
	const passwordVerified = verifyPassElem.value;

	// Check if email already has an account
	// If so, give an invalid message and highlight the login button
	if (findLocalUser(email) !== null) {
		const loginLink = document.getElementById("login-link");
		loginLink.classList.remove("highlight");
		// I'm not sure why this is needed, I will recheck this later
		// TODO: Check
		setTimeout(() => loginLink.classList.add("highlight"), 10);

		return setValidity(emailElem, "Account bestaat al!");
	}

	if (password !== passwordVerified)
		return setValidity(verifyPassElem, "Wachtwoord komt niet overeen");

	// Create a new user with the encrypted password
	const user = {
		email: email,
		password: await encrypt(password),
	};

	// Store the user
	registerUser(user);
	console.log("User added to local storage");
}

/**
 * Tries to log a user in
 * @param {HTMLInputElement} emailElem The input element for the users email
 * @param {HTMLInputElement} passElem The input element for the users password
 * @returns {false | void} False if cancelled (nothing otherwise)
 */
async function login(emailElem, passElem) {
	const email = emailElem.value;
	const password = passElem.value;

	// Look for the email in the registered users
	const user = findLocalUser(email);
	if (user === null) return setValidity(emailElem, "Account bestaat niet");

	// Get the stored password and decrypt it
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
 * Tries to get a user from local storage based on an email address
 * @param {string} email The email of the user to look for
 * @returns The user object if found, null otherwise
 */
function findLocalUser(email) {
	/** @type IUser[] */
	const users = JSON.parse(localStorage.getItem("users")) ?? []; // the `?? []` makes a new list if one does not exist in storage
	return users.find((u) => u.email === email) ?? null;
}

/**
 * Adds a user to local space
 * @param {IUser} user The user to add
 */
function registerUser(user) {
	/** @type IUser[] */
	const users = JSON.parse(localStorage.getItem("users")) ?? [];
	users.push(user);

	localStorage.setItem("users", JSON.stringify(users));
}
