import { Request, Response } from "express";
import { createGuestService, createHostService } from "./auth.service";
import bcrypt from "bcryptjs"

// controllers are in the API lever due to the {request and response}

export const createHostController = async (req:Request, res:Response) => {
  try{
    const host = req.body;
    const hostPasswordHash = host.hostPasswordHash;
    const hashedpassword = await bcrypt.hashSync(hostPasswordHash, 10);
    host.hostPasswordHash = hashedpassword;

    const createHost = await createHostService(host)
    if (!createHost) return res.json({message: "Host not created!"})
    return res.status(201).json({message: "Host created successfully"})

  } catch(error: any){
    return res.status(500).json({error: error.message})
  }
};

// export const createGuestController = async (req:Request, res:Response) => {
//    try{
//     const guest = req.body;
//     const password = guest.password;
//     const hashedpassword = await bcrypt.hashSync(password, 10);
//     guest.password = hashedpassword;

//     const createGuest = await createGuestService(guest)
//     if (!createGuest) return res.json({message: "Guest not created!"})
//     return res.status(201).json({message: createGuest})

//   } catch(error: any){
//     return res.status(500).json({error: error.message})
//   }
// }
