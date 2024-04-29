import type { Express } from "express";

export class Routes {
	constructor(app: Express) {
		app.use((req, res, next) => {
			next();
		});

		app.route("/").get((req, res) => {
			res.render("landing");
		});

		app.route("/home").get((req, res) => {
			res.render("index");
		});

		app.route("/pokedex").get((req, res) => {
			res.render("pokedexlist");
		});

		app.route("/catcher").get((req, res) => {
			res.render("catcher");
		});

		app.route("/comparator").get((req, res) => {
			res.render("comparator");
		});

		app.route("/favicon").get((req, res) => {
			res.render("favicon");
		});

		app.route("/pokelist").get((req, res) => {
			res.render("pokelist");
		});

		app.route("/quiz").get((req, res) => {
			res.render("quiz");
		});

		app.route("/battler").get((req, res) => {
			res.render("battler");
		});

		app.route("/caught").get((req, res) => {
			res.render("caught");
		});
	}
}
