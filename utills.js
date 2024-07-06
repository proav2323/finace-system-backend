import jwt from "jsonwebtoken";
export const checkToken = (req) => {
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) {
    return false;
  }

  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];

  if (!bearerToken) {
    return false;
  }

  const data = jwt.verify(bearerToken, process.env.SECRET ?? "NEW SCRETE");

  if (!data) {
    return false;
  }

  return data;
};
