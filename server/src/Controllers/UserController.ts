import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { RegisterDto, LoginDto } from '../dto/user.dto';
import userModel from '../Models/userModel';

export class UserController {
  private createToken(_id: string, email: string, name: string): string {
    const jwtKey = process.env.JWT_SECRET_KEY!;
    return jwt.sign({ _id, email, name }, jwtKey, { expiresIn: '3d' });
  }

  public async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body as RegisterDto;

      if (!name || !email || !password) {
        res.status(400).json('All fields are required.');
        return;
      }

      if (!validator.isEmail(email)) {
        res.status(400).json('Email is not valid.');
        return;
      }

      if (!validator.isStrongPassword(password)) {
        res.status(400).json('Password is not strong enough.');
        return;
      }

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        res.status(400).json('User with the given email already exists.');
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new userModel({ name, email, password: hashedPassword });
      await newUser.save();

      const token = this.createToken(newUser._id.toString(), email, name);
      res.status(200).json({ _id: newUser._id, name, email, token });
    } catch (error) {
      console.error('Register Error:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }

  public async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as LoginDto;

      const user = await userModel.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(400).json('Invalid email or password.');
        return;
      }

      const token = this.createToken(user._id.toString(), email, user.name);
      res.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }

  public async findUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await userModel.findById(req.params.userId).select('-password');
      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Find User Error:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }

  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userModel.find().select('-password').lean();
      if (!users.length) {
        res.status(404).json({ message: 'No users found.' });
        return;
      }

      res.status(200).json(users);
    } catch (error) {
      console.error('Get Users Error:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
}
