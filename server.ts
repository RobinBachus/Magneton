import express from "express";
import ejs, { render } from "ejs";
import { Routes } from "./routes";

const app = express();

app.engine("ejs", ejs.renderFile);
app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));

new Routes(app);

// app.get("/", (req, res) => {
// 	res.render("index");
// });

app.listen(app.get("port"), () => {
	console.log(`Server running on http://localhost:${app.get("port")}`);
});

export {};
