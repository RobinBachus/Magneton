import { decrypt, encrypt } from "./encryption.js";

/**
 * @typedef {object} user A user stored in local storage
 * @property {string} email The users email address
 * @property {string} password The users password stored as an encrypted string
 */

/** @type HTMLFormElement */
const form = document.getElementsByClassName("login-form")[0];

form.onsubmit = async (ev) => {
	if (ev.target[2].id === "login-password-verify")
		register(ev.target[0], ev.target[1], ev.target[2]);
	else login(ev.target[0], ev.target[1]);
};

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

function setValidity(target, msg) {
	target.setCustomValidity(msg);
	target.reportValidity();
	// This resets the Validity when you type
	target.oninput = async (_ev) => {
		target.setCustomValidity("");
		target.reportValidity();
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
