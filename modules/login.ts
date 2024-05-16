import type { DbUser, DbSession, LoginData } from "../@types/db";
import type { Request, Response, NextFunction } from "express";
import { toUniqueArray } from "./common";
import Database from "./database";

import bcrypt from "bcrypt";

const noAuth = ["/login", "/signup", "/favicon", "/404", "/"];

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
	if (!ip) return null;

	const query = { "session.token": token };

	const user = await db.collections.users?.findOne(query);
	if (!user) return null;

	const session = user.session!;
	if (session.expiration < Date.now()) return null;
	if (!session.known_ips.includes(ip)) return null;

	return user;
}

export async function authSession(
	req: Request,
	res: Response,
	next: NextFunction,
	db: Database
) {
	if (noAuth.includes(req.path)) return next();

	const token = req.signedCookies.session as string | undefined;
	if (!token) return res.redirect("/login");

	const user = await getUserByToken(token, db, req.ip);
	if (!user) return res.redirect("/login");

	return next();
}

export function updateSession(
	session: DbSession | null,
	ip: string | null = null
): DbSession {
	const token = bcrypt.hashSync(Math.random().toString(36).substring(2), 10);
	const expiration = Date.now() + 1000 * 60 * 60 * 24 * 7; // 1 week
	const known_ips = toUniqueArray(session?.known_ips || []);
	if (ip && !known_ips.includes(ip)) known_ips.push(ip);

	return {
		token,
		creation: Date.now(),
		expiration,
		known_ips,
	};
}
