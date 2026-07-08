import { Request, Response } from "express";
import { createApprovalService, deleteApprovalByIdService, deleteApprovalByRoomNumService, getAllApprovalsService, getApprovalByGuestIdService, getApprovalByHostIdService, getApprovalByIdService, getApprovalByRoomNumService, getApprovedApprovalsService, getPendingApprovalsService, getRejectedApprovalsService, updateApprovalByGuestIdService, updateApprovalByIdService, updateApprovalByRoomNumService } from "./approvals.service";
import { getGuestByIdService } from "../guests/guest.service";
import { getRoomByNumService } from "../rooms/room.service";
import { getHostByIdService } from "../auth/auth.service";

//  create approval
export const createApprovalController = async (req: Request, res: Response) => {
  try {
    const approval = req.body
    const newApproval = await createApprovalService(approval)
    if (!newApproval) return res.status(400).json({message: "Unable to generate and create an approval"})
      return res.status(201).json({message: "Approval generated and created", data: newApproval})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// get all approvals
export const getAllApprovalsController = async (req: Request, res: Response) => {
  try {
    const approvals = await getAllApprovalsService()
    if (!approvals || approvals.length===0) return res.status(404).json({message: "No approvals found"})
      return res.status(200).json({data: approvals})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// get approval by its id
export const getApprovalByIdController = async (req: Request, res: Response) => {
  try {
    const approvalId = req.params.approvalId ?? req.body.approvalId
    if (!approvalId) return res.status(400).json({message: "Approval id is required"})

    const ifApprovalIdExist = await getApprovalByIdService(approvalId)
      if (!ifApprovalIdExist) return res.status(400).json({message: "Approval id does not exist"})

    const approval = await getApprovalByIdService(approvalId)
    if (!approval) return res.status(404).json({message: "Approval does not exist"})
      return res.status(200).json({data: approval})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// get approval by room num
export const getApprovalByRoomNumController = async (req: Request, res: Response) => {
  try {
    const roomNum = req.params.roomNum ?? req.body.roomNum
    if (!roomNum) return res.status(400).json({message: "Room num is required"})

    const ifRoomNumExist = await getRoomByNumService(roomNum)
    if (!ifRoomNumExist) return res.status(400).json({message: "Room does not exist"})

    const approval = await getApprovalByRoomNumService(roomNum)
    if (!approval) return res.status(404).json({message: "Approval for that room does not exist"})
      return res.status(200).json({data: approval})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// get approval by guest id
export const getApprovalByGuestIdController =  async (req: Request, res: Response) => {
  try {
    const guestId =  req.params.guestId ?? req.body.guestId
    if (!guestId) return res.status(400).json({message: "Guest id required"})

    const ifGuestIdExist = await getGuestByIdService(guestId)
    if (!ifGuestIdExist) return res.status(400).json({message: "Guest does not exist"})

    const approval = await getApprovalByGuestIdService(guestId)
    if (!approval) return res.status(400).json({message: "Approval for that guest does not exist"})
      return res.status(200).json({data: approval})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// get approval by host id
export const getApprovalByHostIdController =  async (req: Request, res: Response) => {
  try {
    const hostId =  req.params.hostId ?? req.body.hostId
    if (!hostId) return res.status(400).json({message: "Host id required"})

    const ifhostIdExist = getHostByIdService(hostId)
    if (!ifhostIdExist) return res.status(400).json({message: "Host does not exist"})

    const approval = await getApprovalByHostIdService(hostId)
    if (!approval) return res.status(400).json({message: "Approval by that host does not exist"})
      return res.status(200).json({data: approval})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// get pending approvals
export const getPendingApprovalsController = async (req: Request, res: Response) => {
  try {
    const pending = await getPendingApprovalsService()
    if(!pending || pending.length===0) return res.status(404).json({message: "No pending Approvals"})
      return res.status(200).json({data: pending})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

// get approved approvals
export const getApprovedApprovalsController = async (req: Request, res: Response) => {
  try {
    const approved = await getApprovedApprovalsService()
    if(!approved || approved.length===0) return res.status(404).json({message: "No approved approvals"})
      return res.status(200).json({data: approved})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

// get rejected approvals
export const getRejectedApprovalsController = async (req: Request, res: Response) => {
  try {
    const rejected = await getRejectedApprovalsService()
    if(!rejected || rejected.length===0) return res.status(404).json({message: "No rejected approvals"})
      return res.status(200).json({data: rejected})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// update approval by its id
export const updateApprovalByIdController = async (req: Request, res: Response) => {
  try {
    const approvalId = req.params.approvalId ?? req.body.approvalId
    if (!approvalId) return res.status(400).json({message: "Approval id is required"})

    const ifApprovalIdExist = await getApprovalByIdService(approvalId)
    if (!ifApprovalIdExist) return res.status(400).json({message: "Approval id does not exist"})

    const approval = req.body
    const updatedApproval = await updateApprovalByIdService(approvalId, approval)
    if (!updatedApproval) return res.status(400).json({message: "Unable to update approval!"})
      return res.status(200).json({data: updatedApproval})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// update approval by room num
export const updateApprovalByRoomNumController = async (req: Request, res: Response) => {
  try {
    const roomNum = req.params.roomNum ?? req.body.roomNum
    if (!roomNum) return res.status(400).json({message: "Room num is required"})

    const ifroomNumExist = await getRoomByNumService(roomNum)
    if (!ifroomNumExist) return res.status(400).json({message: "Room does not exist"})

    const approval = req.body
    const updatedApproval = await updateApprovalByRoomNumService(roomNum, approval)
    if (!updatedApproval) return res.status(400).json({message: "Unable to update approval!"})
      return res.status(200).json({data: updatedApproval})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// update approval by guest id
export const updateApprovalByGuestIdController = async (req: Request, res: Response) => {
  try {
    const guestId = req.params.guestId ?? req.body.guestId
    if (!guestId) return res.status(400).json({message: "Guest id is required"})

    const ifguestIdExist = await getGuestByIdService(guestId)
    if (!ifguestIdExist) return res.status(400).json({message: "Guest id does not exist"})

    const approval = req.body
    const updatedApproval = await updateApprovalByGuestIdService(guestId, approval)
    if (!updatedApproval) return res.status(400).json({message: "Unable to update approval!"})
      return res.status(200).json({data: updatedApproval})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// delete approval by its id
export const deleteApprovalByIdController = async (req: Request, res: Response) => {
  try {
    const approvalId = req.params.approvalId ?? req.body.approvalId
    if (!approvalId) return res.status(400).json({message: "Approval id is required"})

    const ifApprovalIdExist = await getApprovalByIdService(approvalId)
    if (!ifApprovalIdExist) return res.status(400).json({message: "Approval id does not exist"})

    const deletedApproval = await deleteApprovalByIdService(approvalId)
    if (!deletedApproval) return res.status(400).json({message: "Unable to delete approval!"})
      return res.status(200).json({message: "Approval deleted successfully"})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

// delete approval by room num
export const deleteApprovalByRoomNumController = async (req: Request, res: Response) => {
  try {
    const roomNum = req.params.roomNum ?? req.body.roomNum
    if (!roomNum) return res.status(400).json({message: "Room num is required"})

    const ifroomNumExist = await getRoomByNumService(roomNum)
    if (!ifroomNumExist) return res.status(400).json({message: "Room does not exist"})

    const deletedApproval = await deleteApprovalByRoomNumService(roomNum)
    if (!deletedApproval) return res.status(400).json({message: "Unable to delete approval!"})
      return res.status(200).json({message: "Approval deleted successfully"})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};