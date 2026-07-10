import { Request, Response } from "express";
import { createHostService, deleteHostService, getAllHostService, getHostByIdService, loginHostService, updateHostService } from "./auth.service";
import bcrypt from "bcryptjs"
// import { hostAdminTable } from "../Drizzle/schema";
import jwt from "jsonwebtoken";
import "dotenv/config"

// controllers are in the API lever due to the {request and response}

// create host
export const createHostController = async (req:Request, res:Response) => {
  try{
    const host = req.body;
    const hostPasswordHash = host.hostPasswordHash;
    const hashedpassword = await bcrypt.hashSync(hostPasswordHash, 5);
    host.hostPasswordHash = hashedpassword;

    const createdHost = await createHostService(host)
    if (!createdHost) return res.json({message: "Host not created!"})
      return res.status(201).json({message: "Host created successfully", data: createdHost})
  } catch(error: any){
    return res.status(500).json({error: error.message})
  }
};

// get host by id
export const getHostByIDController = async (req: Request, res: Response) => {
  try {
    const hostId = req.params.hostAdminId ?? req.body.hostAdminId
    if (!hostId) return res.status(400).json({message: "Host id required"})

    const host = await getHostByIdService(hostId)
    if (!host) return res.status(400).json({message: "Host not found"})
      return res.status(200).json({data: host})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// get all hosts
export const getAllHostcontroller = async (req: Request, res: Response) => {
  try {
    const hosts = await getAllHostService()
    if (!hosts || hosts.length===0) return res.status(404).json({mesage: "No hosts found"})
      return res.status(200).json({data: hosts})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// login host
export const loginHostController = async (req: Request, res: Response) => {
  try {
    // const hostEmail = req.params.hostEmail ?? req.body.hostEmail
    // if (!hostEmail) return res.status(400).json({message: "Host email required"})

    
    const host = req.body
    const hostExist = await loginHostService(host)
    if (!hostExist) return res.status(404).json({message: "Host not found"})

    // verify password
    const hostMatch = bcrypt.compareSync(host.hostPasswordHash, hostExist.hostPasswordHash)
    if (!hostMatch) return res.status(401).json({message: "Invalid credentials"})

    // create payload
    const payload = {
      hostPasswordHash: hostExist.hostPasswordHash,
      hostAdminId: hostExist.hostAdminId,
      firstName: hostExist.firstName,
      lastName: hostExist.lastName,
      role: hostExist.role,

      exp: Math.floor(Date.now() / 1000) + 60*60// expire in 1hr
    }

    // generate JWT token
    const secret = process.env.Jwt_SECRET as string
    if (!secret) throw new Error("JWT_SECRET is not defined in your env variables")
    
    const token = jwt.sign(payload, secret)
    return res.status(200).json({
      message: "The login was successful",
      token,
      host: {
      hostAdminId: hostExist.hostAdminId,
      firstName: hostExist.firstName,
      lastName: hostExist.lastName,
      hostEmail: hostExist.hostEmail,
      role: hostExist.role
      }
    })

  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

// update host
export const updateHostController = async (req: Request, res: Response) => {
  try {
    const hostId = req.params.hostId ?? req.body.hostId
    if(!hostId) return res.status(400).json({message: "Host id required"})
    
    const ifHostIdExist = await getHostByIdService(hostId)
    if(!ifHostIdExist) return res.status(400).json({message: "Host not found"})

    const host = req.body
    const updatedHost = await updateHostService(hostId, host)
    if(!updatedHost) return res.status(400).json({message: "Unable to update host"})
      return res.status(200).json({message: "Host updated", data: updatedHost})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};


// delete host
export const deleteHostController = async (req: Request, res: Response) => {
  try {
    const hostId = req.params.hostAdminId ?? req.body.hostAdminId // the hostAdminId must also match what you give at the route level
    if(!hostId) return res.status(400).json({message: "Host id is required"})

    const ifHostIdExist = await getHostByIdService(hostId)
    if(!ifHostIdExist) return res.status(400).json({message: "Host not found"})

    const detedHost = await deleteHostService(hostId)
    if(!detedHost) return res.status(200).json({message: "Host deleted succesfuly"})
      return res.status(200).json({message: "Host deleted succesfuly"})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};