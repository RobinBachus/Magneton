import express from "express";
import ejs, { render } from "ejs";
import dotenv from "dotenv";
import Database from "./modules/database";
import CleanUp from "./modules/cleanup";
import { StatusCode, failed } from "./modules/common";
import Logger from "./modules/logger";
import session from "./middleware/session";
import LoginRouter from "./routes/loginRouter";
import SecureRouter from "./routes/secureRouter";
import MiscRouter from "./routes/miscRouter";
import IRouter from "./routes/router";

dotenv.config();

let cleanup: CleanUp;
let database: Database;

async function main(): Promise<StatusCode> {
	const app = express();

	app.set("view engine", "ejs");
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.static("public"));
	app.use(session);

	app.set("port", process.env.PORT || 3000);

	const { result, status } = await Database.create();
	if (failed(status)) return status;

	database = result!;

	cleanup = new CleanUp(database);

	IRouter.db = database;

	app.use(new LoginRouter().router);
	app.use(new SecureRouter().router);
	app.use(new MiscRouter().router);

	// apiLogger.log((await getPokemonByGen("gen7")).length);

	app.listen(app.get("port"), () => {
		Logger.log(`Server running on http://localhost:${app.get("port")}`);
	});

	return StatusCode.success;
}

main()
	.then((status) => {
		if (cleanup) cleanup.exitCode = status;
	})
	.catch(async (_) => {
		if (cleanup) {
			cleanup.exitCode = StatusCode.failed;
			return;
		}

		if (database) await database.close();

		Logger.error("An unexpected error occurred, exiting...");
		process.exit(StatusCode.failed);
	});

export {};
