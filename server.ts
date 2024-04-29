import express from "express";
import ejs, { render } from "ejs";
import { Routes } from "./modules/routes";
import dotenv from "dotenv";
import { DataBase } from "./modules/database";

dotenv.config();

const app = express();

app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));

// const uri = process.env.DATABASE_URI;
// const certs = process.env.DATABASE_CREDS;

// if (!uri || !certs) {
// 	console.error("Missing database credentials");
// 	process.exit(1);
// }

//const database = new DataBase(uri, certs);
const routes = new Routes(app);

app.listen(app.get("port"), () => {
	console.log(`Server running on http://localhost:${app.get("port")}`);
});

export {};
