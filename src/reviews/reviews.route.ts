import { Express } from "express";
import { createReviewController, deleteReviewController, getAllReviewController, getReviewByGuestIdController, getReviewByIdController, updateReviewByGuestIdController, updateReviewByIdController } from "./reviews.controller";
import { adminRoleAuth, bothRoleAuth } from "../middleware/bearAuth";

const reviews = (app: Express)=>{
  // create review
  app.route("/auth/reviews/create").post(
    // bothRoleAuth,
    async (req, res, next) => {
    try {
      await createReviewController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get all reviews
  app.route("/auth/reviews/all").get(
    // adminRoleAuth,
    async (req, res, next) => {
    try {
      await getAllReviewController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get review by its id
  app.route("/auth/reviews/byid/:reviewId").get(
    // adminRoleAuth,
    async (req, res, next) => {
    try {
      await getReviewByIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  //  get review by room num
  app.route("/auth/reviews/byroomnum/:roomNum").get(
    // bothRoleAuth,
    async (req, res, next) => {
    try {
      await getReviewByGuestIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // update review by its id
  app.route("/auth/reviews/update/byid/:reviewId").patch(
    // adminRoleAuth,
    async (req, res, next) => {
    try {
      await updateReviewByIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // update review by guest id
   app.route("/auth/reviews/update/guestid/:guestId").patch(
    // bothRoleAuth,
    async (req, res, next) => {
    try {
      await updateReviewByGuestIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  //  delete review by its id
  app.route("/auth/reviews/delete/:reviewId").delete(
    // adminRoleAuth,
    async (req, res, next) => {
    try {
      await deleteReviewController(req, res)
    } catch (error) {
      next(error)
    }
  });
}
export default reviews