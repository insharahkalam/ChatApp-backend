// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// export const register = async (req, res) => {
//   const { name, email, password } = req.body;
//   const exists = await User.findOne({ email });
//   if (exists) return res.status(400).json({ msg: "User exists" });
//   const hashed = await bcrypt.hash(password, 10);
//   const user = await User.create({ name, email, password: hashed });
//   res.json({ _id: user._id, name: user.name, email: user.email, token: genToken(user._id) });
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ msg: "Invalid credentials" });
//   const match = await bcrypt.compare(password, user.password);
//   if (!match) return res.status(400).json({ msg: "Invalid credentials" });
//   res.json({ _id: user._id, name: user.name, email: user.email, token: genToken(user._id) });
// };

// export const allUsers = async (req, res) => {
//   const keyword = req.query.search
//     ? { $or: [{ name: { $regex: req.query.search, $options: "i" } }, { email: { $regex: req.query.search, $options: "i" } }] }
//     : {};
//   const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
//   res.json(users);
// };


import userSchema from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import dotenv from "dotenv";
dotenv.config();

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields required. username, email, password",
      })
    }
    if (username.length < 4) {
      return res.status(400).json({
        message: "username must be grater than 4 letters."
      })
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "password must be grater than 6 characters."
      })
    }

    const hashPass = await bcrypt.hash(req.body.password, 10)
    console.log('password hashing====>', hashPass);


    const emailExists = await userSchema.findOne({ email })
    if (emailExists) {
      return res.status(400).json({
        message: "Already exists."
      })
    }
    const user = await userSchema.create({
      username,
      email,
      password: hashPass,
    })
    res.status(200).json({
      message: "user created sucessfully!",
      user
    })

  } catch (error) {
    console.log("error in creating users.=====>", error);
  }

}

const getUser = async (req, res) => {
  const allUser = await userSchema.find()
  res.json({
    message: "user fetched success!",
    allUser
  })
}

const loginUser = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      message: "All feild requird!"
    })
  }
  const logUser = await userSchema.findOne({ email })
  console.log(logUser, "user mil rha hai.");

  if (logUser == null) {
    return res.status(404).json({
      message: "user not found!"
    })
  }

  const decode = await bcrypt.compare(password, logUser.password)
  console.log("logiin check=====>", decode);

  if (!decode) {
    console.log(decode, "deceode check");

    return res.status(400).json({
      message: "Invalid credentials!"
    })
  }

  const token = jwt.sign({ id: logUser.id }, process.env.JWT_SECRETS)

  console.log("jwt ka dedcoded mil rha hai check ====>", token);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: '/'
  });


  console.log(token, "jwt function token");

  res.json({
    message: "User login successful",
    token,
    logUser
  })


}


const logOut = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      path: '/'
    })

    res.status(200).json({
      status: true,
      message: "logout Success!"
    })
  } catch (error) {
    console.log(error, "logout Error");
    res.status(400).json({
      message: "error in logging out",
      status: false
    })
  }
}


export { createUser, getUser, loginUser, logOut }