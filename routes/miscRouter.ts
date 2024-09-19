import { PokemonResultPage } from "../@types/pokemon";
import {
	getPokemonRange,
	getRandomPokemon,
	getRandomPokemonInRange,
} from "../modules/api";
import IRouter from "./router";

export default class MiscRouter extends IRouter {
	constructor() {
		super("main");
	}

	setGetRoutes() {
		this.router.get("/", (req, res) => {
			res.render("landing");
		});

		this.router.get("/favicon", (req, res) => {
			res.render("favicon");
		});

		this.router.get("/error/:code", (req, res) => {
			const code = req.params.code;

			let message;
			if (code === "404")
				message = "De pagina die je zocht kon niet worden gevonden";
			else message = req.query.message || "Er is een fout opgetreden";

			res.status(parseInt(code)).render("error", { code, message });
		});

		this.router.get("/api/getPokemonPage", async (req, res) => {
			let { limit, start } = req.query as {
				limit: string | number;
				start: string | number;
			};
			limit = parseInt(limit as string);
			start = parseInt(start as string);

			if (!limit || !start) {
				res.status(400).json({ error: "Missing parameters" });
				return;
			}

			if (isNaN(limit) || isNaN(start)) {
				res.status(400).json({ error: "Invalid parameters" });
				return;
			}

			const end = start + limit - 1;
			const results = await getPokemonRange(start, end);

			let next = null;
			let previous = null;

			// Check if there are more pages
			if (results.length === limit && end < 1025) {
				next = start + limit;
			}

			if (start >= limit && start > 0) {
				previous = start - limit;
			}

			return res.json({
				results,
				limit,
				start,
				count: results.length,
				next,
				previous,
			} as PokemonResultPage);
		});

		this.router.use((req, res, next) => {
			if (req.method === "GET") res.redirect("/error/404");
			else next();
		});
	}

	setPostRoutes() {
		this.router.post("/api/getRandomPokemon", async (req, res) => {
			let pokemon;
			const { max, min }: { max?: number; min?: number } = req.body;

			if (max && min) pokemon = await getRandomPokemonInRange(min, max);
			else pokemon = await getRandomPokemon();

			res.json(pokemon);
		});

		this.router.use((req, res) => {
			res.status(404).render("error", {
				code: "404",
				message: "This resource does not exist",
			});
		});
	}
}
