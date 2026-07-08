import { Express } from "express";
import { createGuestController, deleteGuestController, getAllGuestController, guestByContactController, guestByIdController, guestByRoomController, loginGuestController, updateguestController } from "./guest.controller";

const guest = (app: Express)=>{
  // create guest
  app.route("/auth/guest/register").post(async (req,res,next) => {
    try {
      await createGuestController(req,res)
    } catch (error) {
      next(error)
    }
  });

  // login guest
  app.route("/auth/guest/login").post(async (req, res, next) => {
    try {
      await loginGuestController(req, res)
    } catch (error) {
      next(error)
    }
  })

  // get all guest
  app.route("/auth/guests").get(async (req,res,next) => {
    try {
      await getAllGuestController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get guest by id
  app.route("/auth/guest/guestbyid/:guestId").get(async (req,res,next) => {
    try {
      await guestByIdController(req,res)
    } catch (error) {
      next(error)
    }
  });
  
  // get guest by contact
  app.route("/auth/guest/guestbycontact/:guestContact").get(async (req,res,next) => {
    try {
      await guestByContactController(req,res)
    } catch (error) {
      next(error)
    }
  });
  
  // get guest by room num
  app.route("/auth/guest/guestbyroomnum/:guestRoomNum").get(async (req,res,next) => {
    try {
      await guestByRoomController(req,res)
    } catch (error) {
      next(error)
    }
  });

  // update guest by contact
  app.route("/auth/guest/updateguest/:guestContact").patch(async (req,res,next) => {
    try {
      await updateguestController(req,res)
    } catch (error) {
      next(error)
    }
  });

  // delete guest by id || contact
  app.route("/auth/guest/deleteguest/:guestContact").delete(async (req, res, next) => {
    try {
      await deleteGuestController(req, res)
    } catch (error) {
      next(error)
    }
  });
}
export default guest;