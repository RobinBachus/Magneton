import IRouter from "./router";
import { secureMiddleware } from "../middleware/secureMiddleware";

export default class SecureRouter extends IRouter {
	constructor() {
		super("secure");
	}

	setGetRoutes() {
		this.router.get("/home", secureMiddleware, (req, res) => {
			res.render("index");
		});

		this.router.get("/pokedex", secureMiddleware, (req, res) => {
			res.render("pokedexlist");
		});

		this.router.get("/catcher", secureMiddleware, (req, res) => {
			res.render("catcher");
		});

		this.router.get("/comparator", secureMiddleware, (req, res) => {
			res.render("comparator");
		});

		this.router.get("/pokelist", secureMiddleware, (req, res) => {
			res.render("pokelist");
		});

		this.router.get("/quiz", secureMiddleware, (req, res) => {
			res.render("quiz");
		});

		this.router.get("/battler", secureMiddleware, (req, res) => {
			res.render("battler");
		});
		this.router.get("/mysterybattler", secureMiddleware, (req, res) => {
			res.render("mysterybattler");
		});
		this.router.get("/caught", secureMiddleware, (req, res) => {
			res.render("caught");
		});
	}
}
