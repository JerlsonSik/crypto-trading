import EmployeeUser from "../models/EmployeeUser.js";
import jwt from 'jsonwebtoken';
import config from "../utility/configs.js";

const ignoreRoutes = ["/login", "/registeruser", "/test"];

const authenticateToken = () => {
  return async (req, res, next)=> {
    // Check if IgnoreRoute includes current path
    if (ignoreRoutes.some((route) => req.path.includes(route))) return next();

    const authHeader = req.headers["authorization"]
    
    // Get the word Bearer from Token
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Authentication token required" });
      return;
    }
    
    try {
      const decoded = jwt.verify(
        token,
        config.JWT_SECRET
      )

      // Find user based on decoded information
      const user = await EmployeeUser.findById(decoded.userId);
      
      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      req.user = decoded;

      next();
    } catch (error) {
      res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};

export default authenticateToken;