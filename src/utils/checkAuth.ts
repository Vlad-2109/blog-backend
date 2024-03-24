/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface DecodedToken extends JwtPayload {
  _id: string;
}

export default (req: Request | any, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret123') as DecodedToken;

      req.userId = decoded._id;

      next();
    } catch (err) {
      return res.status(403).json({ message: 'No access' });
    }
  } else {
    return res.status(403).json({ message: 'No access' });
  }
};
