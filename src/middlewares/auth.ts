import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "config";

interface IResponse extends Response {
  status: any;
}

interface IRequest extends Request {
  user: any;
}

export const auth = (req: IRequest, res: IResponse, next: NextFunction) => {
  let token: any = req.headers.authorization;
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  if (!token) {
    return res.status(401).json({ status: false, message: "token not found" });
  }

  try {
    const decodedInfo = jwt.verify(token, JWT_SECRET as string);
    req.user = decodedInfo;
    next();
  } catch (err) {
    return res.status(403).json({ status: false, message: "invalid token" });
  }
};

// module.exports = auth;
