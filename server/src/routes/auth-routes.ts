import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

import bcryptjs from 'bcryptjs';


export const login = async (req: Request, res: Response) => {
  // TODO: If the user exists and the password is correct, return a JWT token

  const { username, password } = req.body;

  
  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1h' }
    );



    // Respond with the token
   return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }

};


const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;
