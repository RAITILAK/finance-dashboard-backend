import jst from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jst.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user || req.user.status === "inactive") {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user is inactive" });
    }
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, invalid token" });
  }
};

export default protect;
