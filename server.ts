import express from "express";
import ejs, { render } from "ejs";
import cookieParser from "cookie-parser";
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

async function main(): Promise<StatusCode> {
	const app = express();

	app.set("view engine", "ejs");
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser("secret"));
	app.use(express.static("public"));
	app.use(session);

	app.set("port", process.env.PORT || 3000);

	const { result, status } = await Database.create();
	if (failed(status)) return status;

	const database = result!;

	cleanup = new CleanUp(database);

	IRouter.db = database;

	app.use(new LoginRouter().router);
	app.use(new SecureRouter().router);
	app.use(new MiscRouter().router);

	app.listen(app.get("port"), () => {
		Logger.log(`Server running on http://localhost:${app.get("port")}`);
	});

	return StatusCode.success;
}

main().then((status) => {
	if (cleanup) cleanup.exitCode = status;
});

export {};
