import mongoose from "mongoose";

const authSchema = mongoose.Schema({
  username: {
    required: true,
    type: String,
    minLength: 4
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  // avatar:
  // {
  //   type: String,
  //   default: ""
  // }

}, { timestamps: true })

const userSchema = mongoose.model("users", authSchema)
export default userSchema;