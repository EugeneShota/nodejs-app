const express = require("express");
const fs = require("fs");
const hbs = require("hbs");
const expressHbs = require("express-handlebars");
const MongoClient = require("mongodb").MongoClient;

const app = express();

const mongoClient = new MongoClient("mongodb://localhost:27017/", {
    useNewUrlParser: true
});

mongoClient.connect((err, client) => {

    const db = client.db("web-app");
    const collection = db.collection("users");
    let user = {
        name: "admin",
        age: 0
    };
    collection.insertOne(user, (err, result) => {
        if (err) {
            return console.log(err);
        }
        console.log(result.ops);
        client.close();
    });

});

app.engine("hbs", expressHbs({
    layoutsDir: "./public/views/layouts/",
    defaultLayout: "layout",
    extname: "hbs"
}));
app.set("view engine", "hbs");
app.set("views", "./public/views/");
hbs.registerPartials(__dirname + "/public/views/partials/");

const categoryRouter = express.Router();

app.use((req, res, next) => {
    let date = new Date();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let data = `${hour}:${minutes}:${seconds} 
    ${req.method} ${req.url} ${req.get("user-agent")}`;
    console.log(data);
    fs.appendFile("server.log", data + "\n", () => {});
    next();
});

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "../public"));

categoryRouter.get("/news", (req, res) => {
    res.render("article-cont", {
        title: "Новости, Web-студия",
        logo: "Web-студия",
        showPageNav: true
    });
});

categoryRouter.get("/collection", (req, res) => {
    res.render("article-cont", {
        title: "Коллекция, Web-студия",
        logo: "Web-студия",
        showPageNav: true
    });
});

categoryRouter.get("/lesson", (req, res) => {
    res.render("article-cont", {
        title: "Уроки, Web-студия",
        logo: "Web-студия",
        showPageNav: true
    });
});

categoryRouter.get("/programm-review", (req, res) => {
    res.render("article-cont", {
        title: "Обзор программ, Web-студия",
        logo: "Web-студия",
        showPageNav: true
    });
});

categoryRouter.get("/galery", (req, res) => {
    res.render("article-cont", {
        title: "Галерея, Web-студия",
        logo: "Web-студия",
        showPageNav: true
    });
});

categoryRouter.get("/", (req, res) => {
    res.render("category-cont", {
        title: "Разделы, Web-студия",
        logo: "Web-студия",
        showPageNav: false
    });
});

// app.get("/category(.html)?", (req, res) => {
//     res.send("<h2>Category</h2>");
// });

app.use("/category(.html)?", categoryRouter);

app.get("/forum", (req, res) => {
    res.send("<h2>forum</h2>");
});

app.get("/", (req, res) => {
    // res.sendFile(__dirname + "/public/index.html");
    res.render("homeP-cont", {
        title: "Web-студия",
        logo: "Web-студия",
        showPageNav: true
    });
});

app.use("/qwerty", (req, res) => {
    res.status(404).send("Not Found");
});

app.listen(3000);