import { Express } from "express";
import { createReviewController, deleteReviewController, getAllReviewController, getReviewByGuestIdController, getReviewByIdController, updateReviewByGuestIdController, updateReviewByIdController } from "./reviews.controller";

const reviews = (app: Express)=>{
  // create review
  app.route("/review/create").post(async (req, res, next) => {
    try {
      await createReviewController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get all reviews
  app.route("/auth/reviews").get(async (req, res, next) => {
    try {
      await getAllReviewController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get review by its id
  app.route("/auth/reviews/reviewbyid/:reviewId").get(async (req, res, next) => {
    try {
      await getReviewByIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  //  get review by room num
  app.route("/auth/reviews/reviewbyroomnum/:roomNum").get(async (req, res, next) => {
    try {
      await getReviewByGuestIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // update review by its id
  app.route("/auth/reviews/updatereviewbyid/:reviewId").patch(async (req, res, next) => {
    try {
      await updateReviewByIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // update review by guest id
   app.route("/auth/reviews/updatereviewbyguestid/:guestId").patch(async (req, res, next) => {
    try {
      await updateReviewByGuestIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  //  delete review by its id
  app.route("/auth/reviews/delete/:reviewId").delete(async (req, res, next) => {
    try {
      await deleteReviewController(req, res)
    } catch (error) {
      next(error)
    }
  });
}
export default reviews