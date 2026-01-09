import { Router, Request } from "express";
import User from "../model/users.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authMiddleware from "../middleware/auth";
// import sendSMTPEmail from "../config/smtp";
import crypto from "crypto";
import { sendResetEmail } from "../utils/sendResetEmail";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: { _id: string; userName: string };
    }
  }
}

const router = Router();

router.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }

  const user = await User.findOne({
    $or: [{ userName: userName }, { email: email }],
  });

  if (user) {
    return res.status(400).json({
      message:
        user.userName === userName
          ? "UserName is already taken"
          : "Email is already taken",
      sucess: false,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    userName,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  const token = generateToken({
    _id: newUser._id,
    userName: newUser.userName,
  });

  res.status(201).json({ message: "Registration success", token, newUser });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide userName and password", sucess: false });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(401)
      .json({ message: "invalid credentials", sucess: false });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ message: "Password not valid" });
  }

  const token = generateToken({
    _id: user._id,
    email: user.email,
  });

  return res.status(200).json({
    message: "login success",
    token,
    user: {
      _id: user._id,
      userName: user.userName,
      email: user.email,
    },
  });
});

// get loggedIn user details
router.get("/getDetails", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password");

  if (!user) {
    return res.status(400).json({ message: "user not found", success: false });
  }
  res.json(user);
});

// // request password reset
// router.post("/request-password-reset", async (req, res) => {
//   const { email } = req.body;

//   let user = await User.findOne({ email });

//   if (!user) {
//     return res.status(404).json({ message: "user not found", success: false });
//   }

//   const resetToken = jwt.sign(
//     { _id: user._id },
//     process.env.JWT_SECRET as string,
//     { expiresIn: "1h" }
//   );
//   user.resetToken = resetToken;
//   user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

//   await user.save();

//   const subject = "Password reset request for KlintSocial account"
//   const text = `click this link to reset your password: https://klintSocials.com/reset-password?resetToken=${resetToken}`

//  try {
//   await sendSMTPEmail(user.email, subject, text);

//   return res.json({
//     message: "Password link sent to email",
//   });
// } catch (error) {
//   console.error("EMAIL ERROR:", error);

//   return res.status(500).json({
//     message: "Failed to send reset email",
//   });
// }

// });

router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "If the email exists, a link was sent" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

  await user.save();

  console.log("Before sending email");

  await sendResetEmail(user.email, resetToken);

  console.log(`After sending email,being sent to ${user.email}`);

  res.json({ message: "Reset link sent to email" });
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExpires = null;

  await user.save();

  res.json({ message: "Password reset successful" });
});

const generateToken = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET as string);
};

export default router;
