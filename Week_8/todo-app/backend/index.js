const firebase = require("./firebase/cred.js");
const express = require("express");
const cors = require("cors");
const app = express();
const db = firebase.firestore;
const jwt = require('jsonwebtoken');

require("dotenv").config();

app.use(express.json());
const options = {
  origin: "*",
  methods: "GET, POST, DELETE"
}
app.use(cors(options));
app.get("/todo/:email", auth.authMiddleware, async(req, res) => {
    const todos = db.collection("todo");
    let email = req.params.email;
    const query = await todos.where("email", "==", email).get();
    const ret = query.docs.map((data) => data.data());
    res.status(200).json(ret);
})

app.options('/todo/', cors());
app.post("/todo/", auth.authMiddleware, cors(), async(req, res) => {

  const body = req.body
    if(body.email == undefined || body.todo == undefined) {
        return res.json({
          msg: "Error: body undefined",
          data: {},
        });
    }
    const data = {
        email: req.body.email,
        todo: req.body.todo,
        uid: (Math.random() + 1).toString(36).substring(2)
    }

    const query = await db.collection('todo').doc(data.uid).set(data);
    res.status(200).json(query);
})

app.delete("/todo/", cors(), async(req, res) => {
    const body = req.body;
    console.log(body)
    if(body.uid == undefined) {
        return res.json({
          msg: "Error: uid undefined",
          data: {},
        });
    }
    await db.collection("todo").doc(body.uid).delete();
    res.status(200).json("Delete Successful");
})

app.listen(process.env["PORT"], () =>
  console.log("App listening on port " + process.env["PORT"])
);