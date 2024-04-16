import express from "express";
import ejs, { render } from "ejs";

const app = express();

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.render("index");
});

app.listen(app.get("port"), () => {
	console.log(`Server running on port ${app.get("port")}`);
});
