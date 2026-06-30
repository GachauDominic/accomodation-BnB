import { Request, Response } from "express";
import { createGuestService, createHostService } from "./auth.service";
import bcrypt from "bcryptjs"

// controllers are in the API lever due to the {request and response}

export const createHostController = async (req:Request, res:Response) => {
  try{
    const host = req.body;
    const password = host.password;
    const hashedpassword = await bcrypt.hashSync(password, 10);
    host.password = hashedpassword;

    const createHost = await createHostService(host)
    if (!createHost) return res.json({message: "host not created!"})
    return res.status(201).json({message: createHost})

  } catch(error: any){
    return res.status(500).json({error: error.message})
  }
};

export const createGuestController = async (req:Request, res:Response) => {
   try{
    const guest = req.body;
    const password = guest.password;
    const hashedpassword = await bcrypt.hashSync(password, 10);
    guest.password = hashedpassword;

    const createHost = await createHostService(guest)
    if (!createHost) return res.json({message: "host not created!"})
    return res.status(201).json({message: createHost})

  } catch(error: any){
    return res.status(500).json({error: error.message})
  }
}
