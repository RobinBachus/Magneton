import { query } from "express";
import { DbUser, DbSession, LoginData } from "../@types/db";
import { toUniqueArray } from "./common";
import Database from "./database";

import bcrypt from "bcrypt";

export async function attemptLogin(
	loginData: LoginData,
	db: Database
): Promise<DbUser | null> {
	const { email, password, ip } = loginData;

	const user = await db.collections.users?.findOne({ email });
	if (!user) return null;

	if (!(await bcrypt.compare(password, user.hashed_pass))) return null;

	// Update the session
	user.session = updateSession(user.session, ip);

	db.update("users", { email }, user);

	return user;
}

export async function attemptSignup(
	loginData: LoginData,
	db: Database
): Promise<DbUser | null> {
	const { email, password, ip } = loginData;

	const user = await db.collections.users?.findOne({
		email,
	});
	if (user) return null;

	// Hash the password
	const hashed_pass = await bcrypt.hash(password, 10);

	// Create the user
	const newUser: DbUser = {
		email,
		hashed_pass,
		session: updateSession(null, ip),
		username: "",
		avatar: null,
		buddy: null,
		caught: [],
	};

	db.upsert("users", { email }, newUser);

	return newUser;
}

export async function getUserByToken(
	token: string,
	db: Database,
	ip: string | null = null
): Promise<DbUser | null> {
	console.log(token, ip);

	if (!ip) return null;

	const query = { "session.token": token };

	const user = await db.collections.users?.findOne(query);
	if (!user) return null;

	const session = user.session!;
	if (session.expiration < Date.now()) return null;
	if (!session.known_ips.includes(ip)) return null;

	return user;
}

export function updateSession(
	session: DbSession | null,
	ip: string | null = null
): DbSession {
	const token = bcrypt.hashSync(Math.random().toString(36).substring(2), 10); // unique token, 60 characters long
	const expiration = Date.now() + 1000 * 60; // 4 weeks, temp 1 minute for testing
	const known_ips = toUniqueArray(session?.known_ips || []);
	if (ip && !known_ips.includes(ip)) known_ips.push(ip);

	return {
		token,
		creation: Date.now(),
		expiration,
		known_ips,
	};
}
