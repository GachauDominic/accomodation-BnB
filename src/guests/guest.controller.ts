import { Express } from "express";
import { Request,Response } from "express";
import { createGuestService, deleteGuestService, getAllGuestService, guestByContactService, guestByIdService, guestByRoomService, updateGuestService } from "./guest.service";

// create guest
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

export const createGuestController = async (req: Request, res: Response) => {
  try {
    const guest = req.body;
    const createdGuest = await createGuestService(guest);
    if (!createdGuest) return res.json({message: "Unable to create guest"})
    return res.status(201).json({message: "Guest created"})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

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
     const guest = await guestByIdService(guestId)
     if (!guest) {
       return res.status(404).json({message: "Guest not found!"})
     }
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
     const guest = await guestByContactService(guestContact)
     if (!guest) {
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
     const guest = await guestByRoomService(guestRoomNum)
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

    const updateData = req.body
    const existingGuest = await guestByContactService(guestContact)
    if (!existingGuest || existingGuest.length === 0) {
      return res.status(404).json({ message: "Guest not found!" })
    }

    const updatedGuest = await updateGuestService(guestContact, updateData)
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

    const updateData = req.body
    const existingGuest = await guestByContactService(guestContact)
    if (!existingGuest) {
     return res.status(404).json({message: "Guest not found!"})
    }

    const deletedGuest = await deleteGuestService(guestContact)
    if (!deletedGuest) {
      return res.status(400).json({message: "Guest not deleted!"})
    }
    return res.status(200).json({message: "Guest deleted successfully"})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}
