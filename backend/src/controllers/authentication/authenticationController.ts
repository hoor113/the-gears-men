import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { IUser } from "#schemas/usersSchema";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "yourRefreshSecret";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, 
        fullname, 
        email, 
        password, 
        role, 
        phoneNumber, 
        addresses, 
        avatarPicture, 
        vehicleLicenseNumber 
    } = req.body;

    if (!["customer", "storeOwner", "shippingCompany", "deliveryPersonnel"].includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser){ 
        res.status(400).json({ message: "User already exists" });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, fullname, email, hashedPassword, role, phoneNumber, addresses, avatarPicture, vehicleLicenseNumber });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.json({ accessToken, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
