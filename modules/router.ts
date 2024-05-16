import type { Express } from "express";
import type { LoginData } from "../@types/db";
import { Color } from "./common";
import Database from "./database";
import Logger from "./logger";
import { attemptLogin, attemptSignup, authSession } from "./login";

export default class Router extends Logger {
	private _db: Database;
	private _app: Express;

	constructor(app: Express, database: Database, debugLoginRequired = false) {
		super("Router", Color.fg.magenta);

		this._app = app;
		this._db = database;

		if (!debugLoginRequired) return;

		app.use((req, res, next) => authSession(req, res, next, this._db));
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
		app.get("/mysterybattler", (req, res) => {
			res.render("mysterybattler");
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
			let redirect = "back";
			this.log(`Login attempt: ${req.body.email}`);
			this.log(`DEBUG_TEMP: Password: ${req.body.password}\n`);
			const user = await attemptLogin(
				{
					...(req.body as LoginData),
					ip: req.ip,
				},
				this._db
			); // TODO: Handle login

			if (user) {
				redirect = "/home";

				if (user.session) {
					res.cookie("session", user.session.token, {
						httpOnly: true,
						sameSite: "strict",
						secure: true,
						signed: true,
						expires: new Date(user.session.expiration),
						path: "/",
					});
				}
			}

			res.redirect(redirect);
		});

		app.post("/signup", async (req, res) => {
			// TODO: Signup logic
			const user = await attemptSignup(
				{
					...(req.body as LoginData),
					ip: req.ip,
				},
				this._db
			);

			if (user) res.render("/home", { user: req.body.email });
			else res.redirect("back");
		});
	}
}
