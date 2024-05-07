import type { Express } from "express";
import { DataBase } from "./database";
import { DbSession, DbUser } from "../@types/db";
import bcrypt from "bcrypt";

interface LoginData {
	email: string;
	password: string;
	ip?: string;
}

export class Router {
	private _database: DataBase;
	private _app: Express;

	constructor(app: Express, database: DataBase) {
		app.use((req, res, next) => {
			// TODO: temp
			next();
			return;
			if (
				!req.query.session &&
				!req.url.includes("login") &&
				!req.url.includes("signup") &&
				!req.url.includes("404") &&
				req.url !== "/"
			)
				res.redirect("/login");
			else next();
		});

		this._app = app;
		this._database = database;
	}

	setGetRoutes() {
		const app = this._app;

		app.get("/", (req, res) => {
			res.render("landing");
		});

		app.get("/home", (req, res) => {
			res.render("index");
		});

		app.get("/pokedex", (req, res) => {
			res.render("pokedexlist");
		});

		app.get("/catcher", (req, res) => {
			res.render("catcher");
		});

		app.get("/comparator", (req, res) => {
			res.render("comparator");
		});

		app.get("/favicon", (req, res) => {
			res.render("favicon");
		});

		app.get("/pokelist", (req, res) => {
			res.render("pokelist");
		});

		app.get("/quiz", (req, res) => {
			res.render("quiz");
		});

		app.get("/battler", (req, res) => {
			res.render("battler");
		});

		app.get("/caught", (req, res) => {
			res.render("caught");
		});

		app.get("/login", (req, res) => {
			res.render("login");
		});

		app.get("/signup", (req, res) => {
			res.render("signup");
		});
	}

	setPostRoutes() {
		const app = this._app;

		app.post("/login", async (req, res) => {
			let redirect = "/login";
			console.log(req.body);
			const user = await this._attemptLogin({
				...(req.body as LoginData),
				ip: req.ip,
			}); // TODO: Handle login

			if (user) redirect = "/home?session=" + user.session!.token;

			res.redirect(redirect);
		});

		app.post("/signup", (req, res) => {
			// TODO: Signup logic
			this._attemptSignup({
				...(req.body as LoginData),
				ip: req.ip,
			}).then((user) => {});

			res.redirect("/signup");
		});
	}

	private async _attemptLogin(loginData: LoginData): Promise<DbUser | null> {
		const { email, password, ip } = loginData;

		const user = await this._database.collections.users?.findOne({ email });
		if (!user) return null;

		if (!(await bcrypt.compare(password, user.hashed_pass))) return null;

		// Update the session
		user.session = this._updateSession(user.session, ip);

		this._database.update("users", { email }, user);

		return user;
	}

	private async _attemptSignup(loginData: LoginData): Promise<DbUser | null> {
		const { email, password, ip } = loginData;

		const user = await this._database.collections.users?.findOne({ email });
		if (user) return null;

		// Hash the password
		const hashed_pass = await bcrypt.hash(password, 10);

		// Create the user
		const newUser: DbUser = {
			email,
			hashed_pass,
			session: this._updateSession(null, ip),
			username: "",
			avatar: null,
			buddy: null,
			caught: [],
		};

		this._database.upsert("users", { email }, newUser);

		return newUser;
	}

	private _updateSession(
		session: DbSession | null,
		ip: string | null = null
	): DbSession {
		const token = Math.random().toString(36).substring(2);
		const expiration = Date.now() + 1000 * 60 * 60 * 24 * 7 * 4; // 4 weeks
		const known_ips = session?.known_ips ?? [];
		if (ip && !known_ips.includes(ip)) known_ips.push(ip);

		return {
			token,
			creation: Date.now(),
			expiration,
			known_ips,
		};
	}
}
