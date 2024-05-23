import express from "express";
import ejs, { render } from "ejs";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import Router from "./modules/router";
import Database from "./modules/database";
import CleanUp from "./modules/cleanup";
import { StatusCode, failed } from "./modules/common";
import { getRandomPokemon } from "./modules/pokemon";
import Logger from "./modules/logger";

dotenv.config();

let cleanup: CleanUp;

async function main(): Promise<StatusCode> {
	const app = express();

	app.engine("ejs", ejs.renderFile);
	app.set("view engine", "ejs");
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser("secret"));
	app.set("port", process.env.PORT || 3000);
	app.use(express.static("public"));

	// If database is causing issues while testing, comment out the following line
	const { result, status } = await Database.create();

	if (failed(status)) return status;

	const database = result!;

	// DEBUG: Disable login unless explicitly set to true (for testing)
	// const debugLoginRequired = process.env.LOGIN_REQUIRED === "true";

	const router = new Router(app, database, true);
	router.setGetRoutes();
	router.setPostRoutes();

	// If database is causing issues while testing, comment out the following line
	// This will close the database connection when the server is closed
	cleanup = new CleanUp(database);

	Logger.log(await getRandomPokemon());

	app.listen(app.get("port"), () => {
		router.log(`Server running on http://localhost:${app.get("port")}`);
	});

	return StatusCode.success;
}

main().then((status) => {
	if (cleanup) cleanup.exitCode = status;
});

export {};
