import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000, //Maximum age of cookie in Milliseconds
    httpOnly: true, //Prevents attacks like XSS cross-site scripting attacks
    sameSite: "strict", //CSRF attacks cross-ste request forgery attacks
    secure: process.env.NODE_ENV !== "development", //http or https
  });

  return token;
};
