import { Request, Response, NextFunction } from "express";

export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { method, url, query, body } = req;
  const logMessage = `${method} ${url} query:${JSON.stringify(
    query
  )} body:${JSON.stringify(body)}`;
  console.log(logMessage);

  res.on("finish", () => {
    console.log(`Response Status: ${res.statusCode}`);
  });

  next();
}
