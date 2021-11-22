import express from "express";
// import mongodb, { MongoClient } from 'mongodb';
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3016;
app.use(cors());

// const mongoConnectionsString = "mongodb://localhost:27017";
// const mongoConnectString = 'mongodb://localhost:27017';
// const mongoConnectString = 'mongodb://localhost:27017/api001';
const mongoConnectString = process.env.MONGODB_URL;
// const client = new MongoClient(mongoConnectString);
mongoose.connect(mongoConnectString);
app.use(express.json());

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
});
const UserModel = mongoose.model("User", userSchema, "users100");

// const getDatabase = async (done) => {
//   await client.connect();
//   const db = client.db("api001");
//   done(db);
// };

// app.get('/', (req, res) => {
//     res.send("it works(TEST)")
// })

// app.get("/", (req, res) => {
//   getDatabase(async (db) => {
//     const users = await db
//       .collection("users100")
//       .find()
//       .project({
//         name: 1,
//         username: 1,
//         email: 1,
//       })
//       .toArray();
//     res.json(users);
//   });
// });
app.get("/", async (req, res) => {
  const users = await UserModel.find({}).select("name username email");
  res.json(users);
});

// app.get("/allinfo", (req, res) => {
//   getDatabase(async (db) => {
//     const users = await db.collection("users100").find().toArray();
//     res.json(users);
//   });
// });

// app.delete("/deleteuser/:id", (req, res) => {
//   const id = req.params.id;
//   res.send(id);
// });

// app.delete("/deleteuser/:id", (req, res) => {
//   const id = req.params.id;
//   getDatabase(async (db) => {
//     const deleteResult = await db
//       .collection("users100")
//       .deleteOne({ _id: new mongodb.ObjectId(id) });
//     res.json({
//       result: deleteResult,
//     });
//   });
// });

app.delete("/deleteuser/:id", async (req, res) => {
  const id = req.params.id;
  const deleteResult = await UserModel.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  res.json({
    result: deleteResult,
  });
});
// app.post("/adduser/", (req, res) => {
//   const user = req.body.user;
//   getDatabase(async (db) => {
//     const insertResult = await db.collection("users100").insertOne(user);
//     res.json(insertResult);
//   });
// });

app.post("/adduser", async (req, res) => {
  const user = req.body.user;
  const user1 = new UserModel(user);
  user1.save((err) => {
    if (err) {
      res.status(500).send({ err });
    } else {
      res.json({
        userAdded: user1,
      });
    }
  });
});


// app.patch("/edituser/:id", (req, res) => {
//   const id = req.params.id;
//   const email = req.body.email;
//   getDatabase(async (db) => {
//     const updateResult = await db
//       .collection("users100")
//       .updateOne({ _id: new mongodb.ObjectId(id) }, { $set: { email } });
//     res.json({
//       result: updateResult,
//     });
//   });
// });

app.patch("/edituser/:id", async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const updateResult = await UserModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id) },
    { $set: { name, username, email } },
    { new: true }
  );
  res.json({
    result: updateResult,
  });
});

app.listen(port, () => {
  console.log(`listen on http://localhost:${port}`);
});
