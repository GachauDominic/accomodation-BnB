import { Express } from "express";
import { createRoomController, deleteRoomController, getAllRoomsController, getBookedRoomsController, getOccupiedRoomsController, getRoomByGuestController, getRoomByNumController, getVacantRoomsController, updateRoomController } from "./room.controller";
import { TSRoom } from "../Drizzle/schema";

const rooms = (app: Express)=>{
  // create room
  app.route("/auth/createroom").post(async (req, res, next) => {
    try {
      await createRoomController(req, res)
    } catch (error) {
      next(error)
    }
  });

  //  get all rooms
  app.route("/rooms").get(
   async (req, res, next) => {
      try {
        await getAllRoomsController(req, res)
      } catch (error) {
        next(error)
      }
    });

  // get room by number
  app.route("/auth/room").get(
    async (req, res, next) => {
      try {
        await getRoomByNumController(req, res)
      } catch (error) {
        next(error)
      }
    });

  // update room by num
  app.route(`/auth/roomupdate/:num`).patch(
    async (req, res, next) => {
      try {
        await updateRoomController(req, res)
      } catch (error) {
        next(error)
      }
    }
  );

  // delete a room by num
  app.route(`/auth/roomdelete/:num`).delete(
    async (req, res, next) => {
      try {
        await deleteRoomController(req, res)
      } catch (error) {
        next(error)
      }
    }
  );

  // get room by guest contact
  app.route(`/auth/room/:contact`).get(
    async (req, res, next) => {
      try {
        await getRoomByGuestController(req, res)
      } catch (error) {
        next(error)
      }
    }
  );

  // get all vacant rooms
  app.route("/vacantrooms").get(
    async (req, res, next) => {
      try {
        await getVacantRoomsController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )

  // get all booked rooms
  app.route("/bookedrooms").get(
    async (req, res, next) => {
      try {
        await getBookedRoomsController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )
  
  // get all occupied rooms
  app.route("/occupiedrooms").get(
    async (req, res, next) => {
      try {
        await getOccupiedRoomsController(req, res)
      } catch (error) {
        next(error)
      }
    }
  );
}
export default rooms