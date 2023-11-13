import { Request, Response, NextFunction } from "express";

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const method = req.method;
  const url = req.originalUrl;
  const query = JSON.stringify(req.query);
  const body = JSON.stringify(req.body);
  const userAgent = req.get("User-Agent");

  console.log(`Request: ${method} ${url}`);

  if (query !== "{}") {
    console.log(`Query Parameters: ${query}`);
  }

  if (body !== "{}") {
    console.log(`Request Body: ${body}`);
  }

  if (userAgent) {
    console.log(`User Agent: ${userAgent}`);
  }

  next();
}
