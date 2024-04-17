import type { Express } from "express";

export class Routes {
	constructor(app: Express) {
		app.route("/").get((req, res) => {
			res.render("index");
		});
	}
}
