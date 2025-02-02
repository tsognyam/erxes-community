import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export default async function cpUserMiddleware(
  req: Request & { cpUser?: any },
  _res: Response,
  next: NextFunction
) {
  const token = req.cookies['client-auth-token'];
  if (!token) {
    return next();
  }
  try {
    const cpUser: any = jwt.verify(token, process.env.JWT_TOKEN_SECRET || '');
    if (!cpUser) {
      return next();
    }
    // save user in request
    req.cpUser = cpUser;
    req.cpUser.loginToken = token;
    req.cpUser.sessionCode = req.headers.sessioncode || '';
  } catch (e) {
    console.error(e);
    return next();
  }

  return next();
}
