import jwt from "jsonwebtoken";
export const checkToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;

    const data = jwt.verify(bearerToken, process.env.SECRET ?? "NEW SCRETE");

    if (!data) {
      res.send("no authorized").status(403);
    }
    next();
  } else {
    res.send("no token").status(403);
  }
};
