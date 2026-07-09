import { Express } from "express";
import { createRoomController, deleteRoomController, getAllRoomsController, getBookedRoomsController, getOccupiedRoomsController, getRoomByGuestController, getRoomByNumController, getVacantRoomsController, updateRoomController } from "./room.controller";
// import { isAuthenticated } from "../middleware/bearAuth";


const rooms = (app: Express)=>{
  // create room
  app.route("/auth/createroom").post(
    // isAuthenticated,
    async (req, res, next) => {
    try {
      await createRoomController(req, res)
    } catch (error) {
      next(error)
    }
  });

  //  get all rooms
  app.route("/auth/rooms").get(
    // isAuthenticated,
    async (req, res, next) => {
      try {
        await getAllRoomsController(req, res)
      } catch (error) {
        next(error)
      }
    });

  // get room by number
  app.route("/auth/rooms/roombynum:roomNum").get(
    // isAuthenticated,
    async (req, res, next) => {
      try {
        await getRoomByNumController(req, res)
      } catch (error) {
        next(error)
      }
    });

  // update room by num
  app.route("/auth/rooms/roomupdate/:roomNum").patch(
    // isAuthenticated,
    async (req, res, next) => {
      try {
        await updateRoomController(req, res)
      } catch (error) {
        next(error)
      }
    }
  );

  // delete a room by num
  app.route("/auth/rooms/roomdelete/:roomNum").delete(
    // isAuthenticated,
    async (req, res, next) => {
      try {
        await deleteRoomController(req, res)
      } catch (error) {
        next(error)
      }
    }
  );

  // get room by guest contact
  app.route("/auth/rooms/roombyguestcontact/:guestContact").get(
    // isAuthenticated,
    async (req, res, next) => {
      try {
        await getRoomByGuestController(req, res)
      } catch (error) {
        next(error)
      }
    }
  );

  // get all vacant rooms
  app.route("/auth/rooms/vacantrooms").get(
    // isAuthenticated,
    async (req, res, next) => {
      try {
        await getVacantRoomsController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )

  // get all booked rooms
  app.route("/auth/rooms/bookedrooms").get(
    // isAuthenticated,
    async (req, res, next) => {
      try {
        await getBookedRoomsController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )
  
  // get all occupied rooms
  app.route("/auth/rooms/occupiedrooms").get(
    // isAuthenticated,
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