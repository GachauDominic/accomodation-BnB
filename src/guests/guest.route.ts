import { Express } from "express";
import { createGuestController, deleteGuestController, getAllGuestController, guestByContactController, guestByIdController, guestByRoomController, loginGuestController, updateguestController } from "./guest.controller";
import { adminRoleAuth, bothRoleAuth } from "../middleware/bearAuth";

const guest = (app: Express)=>{
  // create guest
  app.route("/auth/guest/register").post(
    adminRoleAuth,
    async (req,res,next) => {
    try {
      await createGuestController(req,res)
    } catch (error) {
      next(error)
    }
  });

  // login guest
  app.route("/auth/guest/login").post(
    bothRoleAuth,
    async (req, res, next) => {
    try {
      await loginGuestController(req, res)
    } catch (error) {
      next(error)
    }
  })

  // get all guest
  app.route("/auth/guests").get(
    // adminRoleAuth,
    async (req,res,next) => {
    try {
      await getAllGuestController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get guest by id
  app.route("/auth/guest/guestbyid/:guestId").get(
    bothRoleAuth,
    async (req,res,next) => {
    try {
      await guestByIdController(req,res)
    } catch (error) {
      next(error)
    }
  });
  
  // get guest by contact
  app.route("/auth/guest/guestbycontact/:guestContact").get(
    bothRoleAuth,
    async (req,res,next) => {
    try {
      await guestByContactController(req,res)
    } catch (error) {
      next(error)
    }
  });
  
  // get guest by room num
  app.route("/auth/guest/guestbyroomnum/:guestRoomNum").get(
    bothRoleAuth,
    async (req,res,next) => {
    try {
      await guestByRoomController(req,res)
    } catch (error) {
      next(error)
    }
  });

  // update guest by contact
  app.route("/auth/guest/updateguest/:guestContact").patch(
    // bothRoleAuth,
    async (req,res,next) => {
    try {
      await updateguestController(req,res)
    } catch (error) {
      next(error)
    }
  });

  // delete guest by contact
  app.route("/auth/guest/deleteguestbycontact/:guestContact").delete(
    // bothRoleAuth,
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await deleteGuestController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // delete guest by id 
  app.route("/auth/guest/deleteguestbyid/:guestId").delete(
    // bothRoleAuth,
    adminRoleAuth,
    async (req, res, next) => {
    try {
      await deleteGuestController(req, res)
    } catch (error) {
      next(error)
    }
  });


}
export default guest;