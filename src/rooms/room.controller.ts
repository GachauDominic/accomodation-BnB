import { Request, Response } from "express";
import { createRoomService, getAllRoomsService, getRoomByNumService, updateRoomService, deleteRoomService, getVacantRoomsService, getBookedRoomsService, getOccupiedRoomsService, getRoomByGuestService } from "./room.service";

//create room
export const createRoomController = async (req:Request, res: Response) => {
  try {
    const room = req.body
    const createdRoom = await createRoomService(room)

    if (!createdRoom) return res.json({message: "Room not created"})
      return res.status(201).json({message: "Room created successfully", data: createdRoom})
  } catch(error: any){
    return res.status(500).json({error: error.message})
  }
}

// Get all rooms controller
export const getAllRoomsController = async(req: Request, res: Response)=>{
  try {
    const rooms = await getAllRoomsService()
    if(!rooms || rooms.length === 0){
      return res.status(404).json({message: `No rooms found!`}) 
    }
    return res.status(200).json({data: rooms})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

// get room by number
export const getRoomByNumController = async (req: Request, res: Response) => {
  try {
    const roomNum = req.params.roomNum ?? req.body.roomNum
    if (!roomNum) {
      return res.status(400).json({message: "Room number is required"})
    }
    const room = await getRoomByNumService(roomNum)
    if (!room) {
      return res.status(404).json({message: "Room not found!"})
    }
    return res.status(200).json({data: room})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

// update room by number
export const updateRoomController = async (req: Request, res: Response) => {
  try {
    const roomNum = req.params.roomNum ?? req.body.roomNum
    if (!roomNum) {
      return res.json({message: "Room number is required"})
    }

    const updateData = req.body
    const existingRoom = await getRoomByNumService(roomNum)
    if (!existingRoom) {
      return res.status(404).json({message: "Room not found!"})
    }

    const updatedRoom = await updateRoomService(roomNum, updateData)
    if (!updatedRoom || updatedRoom.length === 0) {
      return res.status(400).json({message: "Room not updated!"})
    }
    return res.status(200).json({message: "Room updated successfully", data: updatedRoom})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

// delete room by number
export const deleteRoomController = async (req: Request, res: Response) => {
  try {
    const roomNum = req.params.roomNum ?? req.body.roomNum
    if (!roomNum) {
      return res.status(400).json({message: "Room number is required"})
    }

    const existingRoom = await getRoomByNumService(roomNum)
    if (!existingRoom) {
      return res.status(404).json({message: "Room not found!"})
    }

    const deletedRoom = await deleteRoomService(roomNum)
    if (!deletedRoom) {
      return res.status(400).json({message: "Room not deleted!"})
    }
    return res.status(200).json({message: "Room deleted successfully"})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

// get room by guest contact
export const getRoomByGuestController = async (req: Request, res: Response) => {
  try {
    const guestContact = req.params.guestContact ?? req.body.guestContact
    if (!guestContact) {
      return res.status(400).json({ message: "Guest contact is required" })
    }

    const room = await getRoomByGuestService(guestContact)
    if (!room || room.length === 0) {
      return res.status(404).json({ message: "No room found for this guest contact" })
    }
    return res.status(200).json({ data: room })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
} 

// get all vacant rooms
export const getVacantRoomsController = async (req: Request, res: Response) => {
 try {
   const vacantRooms = await getVacantRoomsService()
  if (!vacantRooms) {
    return res.status(404).json({message: "No vacant rooms"})
  }
  return res.status(200).json({data: vacantRooms})
 } catch (error: any) {
  return res.status(500).json({ error: error.message })
 }

}

// get all booked rooms
export const getBookedRoomsController = async (req: Request, res: Response) => {
  try {
    const bookedRooms = await getBookedRoomsService()
    if (!bookedRooms) {
      return res.status(404).json({message: "No booked rooms"})
    }
    return res.status(200).json({data: bookedRooms})
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }  
}

// get all occupied rooms
export const getOccupiedRoomsController = async (req: Request, res: Response) => {
  try {
  const occupiedRooms = await getOccupiedRoomsService()
  if (!occupiedRooms) {
    return res.status(404).json({message: "No occupied rooms"})
  }
  return res.status(200).json({data: occupiedRooms})
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  } 
}