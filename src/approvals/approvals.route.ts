import { Express } from "express";
import { createApprovalController, deleteApprovalByIdController, deleteApprovalByRoomNumController, getAllApprovalsController, getApprovalByGuestIdController, getApprovalByIdController, getApprovalByRoomNumController, getApprovedApprovalsController, getPendingApprovalsController, getRejectedApprovalsController, updateApprovalByGuestIdController, updateApprovalByIdController, updateApprovalByRoomNumController } from "./approvals.controller";
import { adminRoleAuth } from "../middleware/bearAuth";

const approvals = (app: Express)=>{
  // create approval
  app.route("/auth/approval/create").post(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await createApprovalController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get all approvals
  app.route("/auth/approvals").get(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await getAllApprovalsController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get approval by its id
  app.route("/auth/approvals/approvalbyid/:approvalId").get(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await getApprovalByIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get approval by room num
  app.route("/auth/approvals/approvalbyroomnum/:roomNum").get(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await getApprovalByRoomNumController(req, res)
    } catch (error) {
      next(error)
    }
  });
  
  // get approval by guest id
  app.route("/auth/approvals/approvalbyguestid/:guestId").get(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await getApprovalByGuestIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get pending approvals
  app.route("/auth/approvals/pending").get(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await getPendingApprovalsController(req, res)
    } catch (error) {
      next(error)
    }
  })
  
  // get approved approvals
  app.route("/auth/approvals/approved").get(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await getApprovedApprovalsController(req, res)
    } catch (error) {
      next(error)
    }
  })
  
  // get rejected approvals
  app.route("/auth/approvals/rejected").get(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await getRejectedApprovalsController(req, res)
    } catch (error) {
      next(error)
    }
  })

  // update approval by its id
  app.route("/auth/approvals/update/updatebyid/:approvalId").patch(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await updateApprovalByIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // update approval by room num
  app.route("/auth/approvals/update/updatebyroomnum/:roomNum").patch(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await updateApprovalByRoomNumController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // update approval by guest id
  app.route("/auth/approvals/update/updatebyguestid/:guestId").patch(
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await updateApprovalByGuestIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // delete approval by its id
  app.route("/auth/approvals/delete/deletebyid/:approvalId").patch(
    adminRoleAuth,
    async (req, res, next) => {
  try {
    await deleteApprovalByIdController(req, res)
  } catch (error) {
    next(error)
  }
  });

  // delete approval by room num
  app.route("/auth/approvals/delete/deletebyroomnum/:roomNum").patch(
    adminRoleAuth,
    async (req, res, next) => {
  try {
    await deleteApprovalByRoomNumController(req, res)
  } catch (error) {
    next(error)
  }
  });
  
}
export default approvals