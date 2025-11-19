import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const existUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existUser) {
      return res.json({
        success: false,
        message: "Username or Email already exists",
      });
    }

    if (password.length < 6 || password.length > 20) {
      return res.json({
        success: false,
        message: "Password must be between 6 and 20 characters",
      });
    }
    //get random profile image
    const profileImg = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    const user = new User({
      username,
      email,
      password,
      profileImg,
    });

    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, token, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({ success: true, token, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
