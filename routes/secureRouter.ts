import IRouter from "./router";
import { secureMiddleware } from "../middleware/secureMiddleware";
import { genID, genIdLimits, getPokemon } from "../modules/api";

export default class SecureRouter extends IRouter {
	constructor() {
		super("secure");
	}

	setGetRoutes() {
		this.router.get("/home", secureMiddleware, (req, res) => {
			res.sendFile("home.html", { root: "public" });
		});

		this.router.get("/pokedex", secureMiddleware, (req, res) => {
			res.sendFile("pokedexlist.html", { root: "public" });
		});

		this.router.get("/catcher", secureMiddleware, (req, res) => {
			res.sendFile("catcher.html", { root: "public" });
		});

		this.router.get("/comparator", secureMiddleware, (req, res) => {
			res.sendFile("comparator.html", { root: "public" });
		});

		this.router.get("/pokelist", secureMiddleware, (req, res) => {
			res.redirect("/error/404");
		});

		this.router.get(
			"/pokelist/:gen/",
			secureMiddleware,
			async (req, res) => {
				const gen = req.params.gen as genID;

				if (!gen || !gen.match(/gen[1-9]/))
					return res.render("/error/404");

				res.redirect(`/pokelist/${gen}/${genIdLimits[gen].start}`);
			}
		);

		this.router.get(
			"/pokelist/:gen/:id",
			secureMiddleware,
			async (req, res) => {
				const gen = req.params.gen as genID;
				const id = req.params.id;

				if (!gen || !id || isNaN(+id) || !gen.match(/gen[1-9]/))
					return res.redirect("/error/400");

				const pokemon = await getPokemon(id); //gen_pokemon.find((p) => p.id === +id);

				if (!pokemon)
					return res.redirect(
						"/error/404?msg=this Pokemon does not seem to exist"
					);

				res.sendFile("pokelist.html", {
					root: "public",
				});
			}
		);

		this.router.get("/quiz", secureMiddleware, (req, res) => {
			res.sendFile("quiz.html", { root: "public" });
		});

		this.router.get("/battler", secureMiddleware, (req, res) => {
			res.sendFile("battler.html", { root: "public" });
		});

		this.router.get(
			"/mysterybattler",
			secureMiddleware,
			async (req, res) => {
				res.sendFile("mysterybattler.html", { root: "public" });
			}
		);

		this.router.get("/api/user", secureMiddleware, (req, res) => {
			res.json(res.locals.user);
		});
	}
}
