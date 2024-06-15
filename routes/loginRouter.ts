import { NextFunction, Request, Response } from "express";
import { LoginData } from "../@types/db";
import { secureMiddleware } from "../middleware/secureMiddleware";
import { attemptLogin, attemptSignup } from "../modules/login";
import IRouter from "./router";

const paths = ["/login", "/signup", "/favicon", "/error"];

export default class LoginRouter extends IRouter {
	constructor() {
		super("login");
	}

	setGetRoutes() {
		this.router.get("/login", this.isLoggedIn, (req, res) => {
			res.render("login");
		});

		this.router.get("/signup", this.isLoggedIn, (req, res) => {
			res.render("signup");
		});
	}

	setPostRoutes(): void {
		this.router.post("/login", this.isLoggedIn, async (req, res) => {
			this.log(`Login attempt: ${req.body.email}`);

			try {
				const user = await attemptLogin(req.body as LoginData);
				req.session.user = user;
				res.redirect(this.getRedirectPath(res.locals.redirect));
			} catch (e) {
				res.redirect("/login");
			}
		});

		this.router.post("/signup", this.isLoggedIn, async (req, res) => {
			this.log(`Signup attempt: ${req.body.email}`);

			try {
				const user = await attemptSignup(req.body as LoginData);
				req.session.user = user;

				res.redirect(this.getRedirectPath(res.locals.redirect));
			} catch (e) {
				res.redirect("/signup");
			}
		});

		this.router.post("/logout", secureMiddleware, async (req, res) => {
			req.session.destroy((err) => {
				res.redirect("/login");
			});
		});
	}

	private isLoggedIn(req: Request, res: Response, next: NextFunction) {
		if (req.session.user) res.redirect("/home");
		else next();
	}

	private getRedirectPath(path: string = "/home"): string {
		return paths.includes(path) ? "/home" : path;
	}
}
