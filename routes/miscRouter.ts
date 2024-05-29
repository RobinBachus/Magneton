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

			res.render("error", { code, message });
		});
	}
}
