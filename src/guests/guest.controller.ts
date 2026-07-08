import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import "dotenv/config"
import { Request,Response } from "express";
import { createGuestService, deleteGuestService, getAllGuestService, getGuestByContactService, getGuestByIdService, getGuestByRoomService, loginGuestService, updateGuestService } from "./guest.service";

// create guest
export const createGuestController = async (req: Request, res: Response) => {
  try {
    const guest = req.body;
    const createdGuest = await createGuestService(guest);
    if (!createdGuest) return res.json({message: "Unable to create guest"})
    return res.status(201).json({message: "Guest created", data: guest})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// login guest
export const loginGuestController = async (req: Request, res: Response) => {
  try {
    const guest = req.body
    const guestExist = await loginGuestService(guest)
    if (!guestExist) return res.status(404).json({message: "Guest not found"})

    // create payload
    const payload = {
      guestContact: guestExist.guestContact,
      guestId: guestExist.guestId,
      guestfirstName: guestExist.guestfirstName,
      guestlastName: guestExist.guestlastName,

      exp: Math.floor(Date.now() / 1000) + 60 // expire in 60sec
    }

    // generate JWT token
    const secret = process.env.Jwt_SECRET as string
    if (!secret) throw new Error("JWT_SECRET is not defined in your env variables")
    
    const token = jwt.sign(payload, secret)
    return res.status(200).json({
      message: "The login was successful",
      token,
      host: {
      guestId: guestExist.guestId,
      guestfirstName: guestExist.guestfirstName,
      guestlastName: guestExist.guestlastName,
      }
    })

  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

// get all guests
export const getAllGuestController = async (req: Request, res: Response) => {
 try {
  const guests = await getAllGuestService()
  if(!guests || guests.length === 0) return res.status(404).json({message: "No guests available"})
  return res.status(200).json({data: guests})
 } catch (error: any) {
  return res.status(500).json({error: error.message})
 }
};

// get guest by id
export const guestByIdController = async (req: Request, res: Response) => {
  try {
    const guestId = req.params.guestId ?? req.body.guestId
    if (!guestId) {
      return res.status(400).json({message: "Guest Id required"})
    }

    // const ifGuestIdExist = await getGuestByIdService(guestId)
    // if (!ifGuestIdExist) return res.status(404).json({message: "Guest not found"})
    
    const guest = await getGuestByIdService(guestId)
    if (!guest || guest.length===0) { return res.status(404).json({message: "Guest not found!"}) }
      return res.status(200).json({data: guest})
   } catch (error: any) {
     return res.status(500).json({error: error.message})
  }
}
// get guest by contact
export const guestByContactController = async (req: Request, res: Response) => {
  try {
     const guestContact = req.params.guestContact ?? req.body.guestContact
     if (!guestContact) {
       return res.status(400).json({message: "Guest contact required"})
     }
     const guest = await getGuestByContactService(guestContact)
     if (!guest || guest.length===0) {
       return res.status(404).json({message: "Guest not found!"})
     }
     return res.status(200).json({data: guest})
   } catch (error: any) {
     return res.status(500).json({error: error.message})
  }
}

// get guest by room num
export const guestByRoomController = async (req: Request, res: Response) => {
  try {
     const guestRoomNum = req.params.guestRoomNum ?? req.body.guestRoomNum
     if (!guestRoomNum) {
       return res.status(400).json({message: "Room number of the guest required"})
     }
     const guest = await getGuestByRoomService(guestRoomNum)
     if (!guest || guest.length === 0) {
       return res.status(404).json({message: "Guest not found!"})
     }
     return res.status(200).json({data: guest})
   } catch (error: any) {
     return res.status(500).json({error: error.message})
  }
}

// update guest by contact
export const updateguestController = async (req: Request, res: Response) => {
  try {
    const guestContact = req.params.guestContact ?? req.body.guestContact
    if (!guestContact) {
      return res.status(400).json({ message: "Guest contact is required" })
    }

    const guest = req.body
    const existingGuest = await getGuestByContactService(guestContact)
    if (!existingGuest || existingGuest.length === 0) {
      return res.status(404).json({ message: "Guest not found!" })
    }

    const updatedGuest = await updateGuestService(guestContact, guest)
    if (!updatedGuest) {
      return res.status(400).json({ message: "Guest not updated!" })
    }
    return res.status(200).json({ message: "Guest updated successfully", data: updatedGuest })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

// delete guest by id || contact
export const deleteGuestController = async (req: Request, res: Response) => {
  try {
    // const guestId = req.params.guestId ?? req.body.guestId
    // if (!guestId) {
    //   return res.status(400).json({message: "Guest Id is required"})
    // }
    const guestContact = req.params.guestContact ?? req.body.guestContact
    if (!guestContact) {
      return res.status(400).json({message: "Guest contact is required"})      
    }

    const existingGuest = await getGuestByContactService(guestContact)
    if (!existingGuest) {
     return res.status(404).json({message: "Guest not found!"})
    }

    const deletedGuest = await deleteGuestService(guestContact)
    if (!deletedGuest) return res.status(400).json({message: "Guest not deleted!"})
      return res.status(200).json({message: "Guest deleted successfully"})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}
