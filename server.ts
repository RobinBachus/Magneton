import express from "express";
import ejs, { render } from "ejs";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import Router from "./modules/router";
import Database from "./modules/database";
import CleanUp from "./modules/cleanup";
import { getRandomPokemon } from "./modules/pokemon";

dotenv.config();

async function main() {
	const app = express();

	app.engine("ejs", ejs.renderFile);
	app.set("view engine", "ejs");
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser("secret"));
	app.set("port", process.env.PORT || 3000);
	app.use(express.static("public"));

	// If database is causing issues while testing, comment out the following line
	const database = await dbInit();

	// DEBUG: Disable login unless explicitly set to true (for testing)
	const debugLoginRequired = process.env.LOGIN_REQUIRED === "true";

	const router = new Router(app, database, debugLoginRequired);
	router.setGetRoutes();
	router.setPostRoutes();

	// If database is causing issues while testing, comment out the following line
	// This will close the database connection when the server is closed
	new CleanUp(database);

	console.log(await getRandomPokemon());

	app.listen(app.get("port"), () => {
		router.log(`Server running on http://localhost:${app.get("port")}`);
	});
}

async function dbInit() {
	const uri = process.env.DATABASE_URI;
	const certs = process.env.DATABASE_CREDS;

	if (!uri || !certs) {
		console.error("Missing database credentials");
		process.exit(1);
	}

	const database = new Database(uri, certs);

	database.onReady(() => {
		database.log("Database is ready");
	});

	await database.connect();

	return database;
}

main();

export {};
