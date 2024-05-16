import type { Express } from "express";
import type { LoginData } from "../@types/db";
import Database from "./database";
import { attemptLogin, attemptSignup, getUserByToken } from "./login";
import Logger from "./logger";
import { Color, TColor } from "./common";

const noAuth = ["/login", "/signup", "/favicon", "/404", "/"];

export class Router extends Logger {
	private _db: Database;
	private _app: Express;

	constructor(app: Express, database: Database) {
		super("Router", Color.fg.magenta);

		app.use(async (req, res, next) => {
			const session = req.query.session as string | undefined;

			if (noAuth.includes(req.url)) next();
			else if (!session) res.redirect("/login");
			else {
				const user = await getUserByToken(session, this._db, req.ip);

				if (!user) res.redirect("/login");
				else {
					res.locals.user = user;
					next();
				}
			}
		});

		this._app = app;
		this._db = database;
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
			const user = await attemptLogin(
				{
					...(req.body as LoginData),
					ip: req.ip,
				},
				this._db
			); // TODO: Handle login

			if (user) redirect = "/home?session=" + user.session!.token;

			res.redirect(redirect);
		});

		app.post("/signup", (req, res) => {
			// TODO: Signup logic
			attemptSignup(
				{
					...(req.body as LoginData),
					ip: req.ip,
				},
				this._db
			).then((user) => {});

			res.redirect("/signup");
		});
	}
}
