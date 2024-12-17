const express = require("express")
const app = express();
const path = require("path");
const mysql = require("mysql2");
const methodoverride = require("method-override");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
let port = 3000;



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodoverride("_method"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'studentdata',
    password: "#Prath@8%"
});

app.listen(port, () => {
    console.log("app is now listening");
})




app.get("/", (req, res) => {
    res.render("home");
})




app.get("/login", (req, res) => {
    res.render("login");
})


app.post("/", (req, res) => {
    let { id, upassword } = req.body;
    let q = `select * from student where id=${id}`
    try {
        connection.query(q, (err, result) => {

            if (result.length == 1) {
                let { id, name, password } = result[0];
                console.log(upassword);
                console.log(password);
                if (upassword == password) {
                    let url = `/${id}`;
                    res.redirect(url);
                }
                else {
                    res.redirect("/wlogin")
                }
            }
            else {
                res.send("data not found");
            }
        })
    }
    catch (err) {
        res.send("query error");
    }
})

app.get("/wlogin", (req, res) => {
    res.render("login2");
})


app.post("/signup", (req, res) => {
    let { name, id, password } = req.body;
    let q = `insert into student values (${id},"${name}","${password}")`;
    let q2 = `insert into data (id) values (${id})`;
    try {
        connection.query(q, (err, result) => {
            if (result) {
                try {
                    connection.query(q2, (err, result) => {
                        if (result) {
                            let url = `/${id}`;
                            res.redirect(url);
                        }
                        else res.send(err);
                    })
                }
                catch (err) {
                    res.send("query error");
                }
            }
            else res.send("id already exist");
        })
    }
    catch (err) {
        res.send("query error");
    }
})

app.get("/:id/scanner", (req, res) => {
    let { id } = req.params;
    res.render("scan", { id });
})

app.get("/:date/:id/attendense", (req, res) => {
    let { date, id } = req.params;

    let q = "update data set `" + date + "`=" + `"present" where id=${id};`;

    try {
        connection.query(q, (err, result) => {
            if (result) { res.render("aft_att", { id }) }
            else console.log("ok");
        })
    }
    catch (err) {
        res.send("query error");
    }
})

app.get("/:id", (req, res) => {
    let { id } = req.params;
    let q = `select * from student where id=${id}`;
    try {
        connection.query(q, (err, result) => {
            if (result) {
                let { id, name, password } = result[0];
                res.render("shome", { id, name, password })
            }
            else console.log("data is not matched")

        })
    }
    catch (err) {
        res.send("query error");
    }
})
