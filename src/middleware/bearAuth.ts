import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import "dotenv/config"

// middleware to check if user is loggedin
// export const isAuthenticated = (req: Request, res: Response, next: NextFunction)=>{
//   const authHeader = req.headers.authorization
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" })
//   }

//   const token = authHeader.split(" ")[1]
//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" })
//   }

//   const secret = process.env.JWT_SECRET
//   if (!secret) {
//     return res.status(500).json({ message: "Server configuration error" })
//   }

//   try {
//     const decode = jwt.verify(token, secret as string);
//     (req as any).user = decode
//     return next()
//   } catch (error: any) {
//     return res.status(401).json({ message: "Invalid token" })
//   }

// };


// middleware to check for the authentication loggedin and roles
export const checkRole = (requiredRole: "hostAdmin" | "guest" | "both")=>{
  return (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).json({message: "Unauthorized"});
    return;
  }

  const token = authHeader.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return res.status(500).json({ message: "Server configuration error" })
  }

  try {
    const decoded = jwt.verify(token, secret as string);
    (req as any).user = decoded

    //check for roles
    if (
      typeof decoded === "object" &&  //ensure decoded is an object
      decoded !== null && // ensure decoded is not null
      "role" in decoded //ensure the decoded token has a role property
    ) {
      // const role = (decoded as jwt.JwtPayload).role;
      if(requiredRole === "both"){
        // allowing any
        if(decoded.role === "hostAdmin" || decoded.role === "guest"){
          next()
          return;
        }//if both then they can access 
      } else if (decoded.role === requiredRole){
        next();
          return;
        }
        res.status(401).json({message:"Unauthorized"})
        return;
    } else {
        res.status(401).json({message:"Invalid token payload"})
        return;
    }
  } catch (error) {
    res.status(500).json({message: "Invalid token"})
    return;
  }
  }
};
export const adminRoleAuth = checkRole("hostAdmin")
export const userRoleAuth = checkRole("guest")
export const bothRoleAuth = checkRole("both")