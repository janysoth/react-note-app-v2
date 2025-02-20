import jwt from "jsonwebtoken";

// Use User id to generate Token
const generateToken = (id) => {
  // Token must be returned to the Client
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;