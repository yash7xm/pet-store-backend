import Express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

dotenv.config({
  path: ".env",
});

const app = Express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_PROD_URL)
  .then(() => console.log("connected db"))
  .catch((err) => console.log(err));

let sessionId;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username cannot be blank"],
    unique: true,
  },
  pass: {
    type: String,
    required: [true, "password cannot be blank"],
  },
  chats: [
    {
      talkingTo: String,
      conversation: [
        {
          sending: Boolean,
          meesage: String,
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
});

const User = mongoose.model("User", UserSchema);

app.get("/delete", async (req, res) => {
  await User.deleteMany({});
  res.sendStatus(200);
});

app.get("/users", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

app.post("/register", async (req, res) => {
  let { username, password } = req.body;

  username = username.replace(/\s+/g, " ").trim();
  password = password.replace(/\s+/g, " ").trim();

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  const user = new User({
    username: username,
    pass: hash,
  });

  await user.save();

  const userId = user._id;

  res.cookie("userId", userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
  console.log(req.cookies.userId);
  sessionId = res.cookie.userId;

  //   res.sendStatus(200);
  res.json(userId);
});

app.post("/checkUserExist", async (req, res) => {
  const checkUsername = await User.findOne({ username: req.body.username });
  if (checkUsername) res.sendStatus(200);
  else res.sendStatus(404);
});

app.post("/signIn", async (req, res) => {
  let { username, password } = req.body;

  username = username.replace(/\s+/g, " ").trim();
  password = password.replace(/\s+/g, " ").trim();

  const user = await User.findOne({ username: username });

  const validPassword = await bcrypt.compare(password, user.pass);
  if (validPassword) {
    const userId = user._id;

    res.json(userId);
  } else res.sendStatus(404);
});

app.post("/getData", (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("root");
});

app.listen(8080, (req, res) => {
  console.log("Server is now open");
});
