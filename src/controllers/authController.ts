import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { signToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();

    return res.status(201).json({ message: "Created user succesfullt" });
  } catch (error) {
    return res.status(500).json({ message: "Error to create", error });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await (User as any).findOne({ email }).exec();
    if (!user) {
      return res.status(401).json({ message: "Not founded user" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = signToken({ id: user._id, username: user.username });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Login error", error });
  }
};
