/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import UserModel from '../models/user';

export const register = async (req: Request, res: Response) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign({ _id: user._id }, 'secret123', {
      expiresIn: '30d',
    });

    const { passwordHash, ...userData } = user.toJSON();

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Fault to register',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User is not found' });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user.passwordHash,
    );

    if (!isValidPass) {
      return res
        .status(400)
        .json({ message: 'Login or password is incorrect' });
    }

    const token = jwt.sign({ _id: user._id }, 'secret123', {
      expiresIn: '30d',
    });

    const { passwordHash, ...userData } = user.toJSON();

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Fault to login',
    });
  }
};

export const getMe = async (req: Request | any, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { passwordHash, ...userData } = user.toJSON();

    res.json({
      ...userData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'No access' });
  }
};
