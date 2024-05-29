import dotenv from "dotenv";
import session from "express-session";
import mongoDbSession from "connect-mongodb-session";
import Logger from "../modules/logger";
import { SecureUser } from "../@types/db";

dotenv.config();

const { DATABASE_URI, DATABASE_CERT, SESSION_SECRET } = process.env;
if (!DATABASE_URI || !DATABASE_CERT || !SESSION_SECRET) {
	throw new Error("Missing environment variables");
}

const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
	uri: DATABASE_URI,
	collection: "Sessions",
	databaseName: "Users",
	connectionOptions: {
		tlsCertificateKeyFile: DATABASE_CERT,
	},
});

mongoStore.on("error", (error) => {
	Logger.error(error, "session");
});

declare module "express-session" {
	export interface SessionData {
		user?: SecureUser;
	}
}

export default session({
	secret: SESSION_SECRET,
	store: mongoStore,
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
	},
});
