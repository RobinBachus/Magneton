import IRouter from "./router";
import { secureMiddleware } from "../middleware/secureMiddleware";
import {
	genID as GenID,
	genIdLimits,
	getPokemonByGen,
	getRandomPokemon,
} from "../modules/api";

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
			res.redirect("/error/404");
		});

		this.router.get(
			"/pokelist/:gen/",
			secureMiddleware,
			async (req, res) => {
				const gen = req.params.gen as GenID;

				if (!gen || !gen.match(/gen[1-9]/))
					return res.render("/error/404");

				res.redirect(`/pokelist/${gen}/${genIdLimits[gen].start}`);
			}
		);

		this.router.get(
			"/pokelist/:gen/:id",
			secureMiddleware,
			async (req, res) => {
				const gen = req.params.gen as GenID;
				const id = req.params.id;

				if (!gen || !id || isNaN(+id) || !gen.match(/gen[1-9]/))
					return res.redirect("/error/404");

				const gen_pokemon = await getPokemonByGen(gen);
				const pokemon = gen_pokemon.find((p) => p.id === +id);

				if (!pokemon) return res.redirect("/error/404");

				res.render("pokelist", { gen_pokemon, pokemon, gen: gen[3] });
			}
		);

		this.router.get("/quiz", secureMiddleware, (req, res) => {
			res.render("quiz");
		});

		this.router.get("/battler", secureMiddleware, (req, res) => {
			res.render("battler");
		});

		this.router.get(
			"/mysterybattler",
			secureMiddleware,
			async (req, res) => {
				res.render("mysterybattler", {
					pokemon: await getRandomPokemon(true),
				});
			}
		);
	}
}
