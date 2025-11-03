import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { SecureUser } from "../@types/db";

dotenv.config();

const { LOGIN_ENABLED } = process.env;

export function secureMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (LOGIN_ENABLED !== "true") {
		res.locals.user = getTempUser();
		next();
	} else if (req.session.user) {
		res.locals.user = req.session.user;
		next();
	} else {
		res.redirect("/login");
	}
}

function getTempUser() {
	return {
		email: "test@test.com",
		username: "[object Object]",
		avatar: "/assets/img/pfp6.png",
		buddy: null,
		caught: [],
	} as SecureUser;
}
