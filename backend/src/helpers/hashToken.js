import crypto from "node:crypto";

const hashToken = (token) => {
  // Hash the token using sha256 algorithm 
  return crypto.createHash("sha256").update(token.toString()).digest("hex");
};

export default hashToken;