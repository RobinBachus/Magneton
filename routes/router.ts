import { Color } from "../modules/common";
import Database from "../modules/database";
import Logger from "../modules/logger";

import express from "express";

import type { Router } from "express";

export default abstract class IRouter extends Logger {
	static db: Database;

	router: Router;

	constructor(routeName: string) {
		super(`Router - ${routeName}`, Color.fg.magenta);

		this.router = express.Router();
		this.setGetRoutes();
		this.setPostRoutes();
	}

	abstract setGetRoutes(): void;
	setPostRoutes(): void {}
}
