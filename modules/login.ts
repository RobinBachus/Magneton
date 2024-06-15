import type { DbUser, LoginData, SecureUser } from "../@types/db";
import IRouter from "../routes/router";

import bcrypt from "bcrypt";

const noAuth = ["/login", "/signup", "/favicon", "/error", "/"];

/**
 * @throws Error if email or password is missing
 * @throws Error if user is not found
 * @throws Error if password is incorrect
 */
export async function attemptLogin(loginData: LoginData): Promise<SecureUser> {
	const { email, password } = loginData;

	if (!email || !password)
		throw new Error("Email en wachtwoord zijn verplicht");

	const user = await IRouter.db.collections.users?.findOne({ email });

	if (!user || !(await bcrypt.compare(password, user.hashed_pass)))
		throw new Error("Email of wachtwoord is onjuist");

	let sUser = user as SecureUser;
	delete sUser.hashed_pass;
	delete sUser._id;

	return sUser;
}

/**
 * @throws Error if user already exists
 * @throws Error if user could not be created
 */
export async function attemptSignup(loginData: LoginData): Promise<SecureUser> {
	const { username, email, password, avatar } = loginData;

	const user = await IRouter.db.collections.users?.findOne({
		email,
	});
	if (user) throw new Error("Gebruiker bestaat al");

	// Hash the password
	const hashed_pass = await bcrypt.hash(password, 10);

	// Create the user
	const newUser: DbUser = {
		email,
		hashed_pass,
		username,
		avatar,
		buddy: null,
		caught: [],
	};

	const res = await IRouter.db.upsert("users", { email }, newUser);

	if (res?.upsertedCount !== 1)
		throw new Error("Gebruiker kon niet worden aangemaakt");

	let sUser = newUser as SecureUser;
	delete sUser.hashed_pass;
	delete sUser._id;

	return sUser;
}
