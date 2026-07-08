import { Request, Response } from "express";
import { createReviewService, deleteReviewService, getAllReviewsService, getReviewByIdService, getReviewByRoomNumService, updateReviewByIdService } from "./reviews.service";
import { getGuestByIdService } from "../guests/guest.service";


// create a review
export const createReviewController = async (req: Request, res: Response) => {
  try {
    const review = req.body
    const newReview = await createReviewService(review)
    return res.status(201).json({message: "Review was created", data: newReview})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// get all reviews
export const getAllReviewController = async (req: Request, res: Response) => {
  try {
    const reviews = await getAllReviewsService()
    if (!reviews || reviews.length===0) return res.status(404).json({message: "No reviews available"})
      return res.status(200).json({data: reviews})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// get review by its id
export const getReviewByIdController = async (req: Request, res: Response) => {
  try {
  const reviewId = req.params.reviewId ?? req.body.reviewId    
  if (!reviewId) return res.json({message: "Review id required"})

  const review = await getReviewByIdService(reviewId)
  if (!review) return res.status(404).json({message: "Review does not exist"})
    return res.status(200).json({data: review})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

//  get review by room num
export const getReviewByGuestIdController = async (req: Request, res: Response) => {
  try {
  const roomNum = req.params.roomNum ?? req.body.roomNum    
  if (!roomNum) return res.json({message: "Review id required"})

  const ifRoomNumExist = await getReviewByRoomNumService(roomNum)
  if (!ifRoomNumExist) return res.status(404).json({message: "Room does not exist"})
  
  const review = await getReviewByRoomNumService(roomNum)
  if (!review) return res.status(404).json({message: "No review for that room"})
    return res.status(200).json({data: review})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// update review by its id
export const updateReviewByIdController = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId ?? req.body.reviewId
    if (!reviewId) return res.json({message: "Review id required"})

    const ifReviewIdExist = await getReviewByIdService(reviewId)
    if (!ifReviewIdExist) return res.status(404).json({message: "Review does not exist"})
      
    const review = req.body
    if (review.reviewCreatedAt){
      review.reviewCreatedAt = new Date(review.reviewCreatedAt)
    }
    const updatedReview = await updateReviewByIdService(reviewId, review)
    if (!updatedReview) return res.status(400).json({message: "Review was not updated"})
      return res.status(200).json({message: "Review updated successfully", data: updatedReview})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// update review by guest id
export const updateReviewByGuestIdController = async (req: Request, res: Response) => {
  try {
    const guestId = req.params.guestId ?? req.body.guestId
    if (!guestId) return res.status(400).json({message: "Guest id required"})

    const ifGuestIdExist = await getGuestByIdService(guestId)
    if (!ifGuestIdExist) return res.status(404).json({message: "Guest does not exist"})

    const review = req.body
    if (review.reviewCreatedAt){
      review.reviewCreatedAt = new Date(review.reviewCreatedAt)
    }
    if (!review) return res.status(404).json({message: "Review does not exist"})

    const updatedReview = await updateReviewByIdService(guestId, review)
    if (!updatedReview) return res.status(400).json({message: "Review was not updated"})
      return res.status(200).json({message: "Review updated successfully", data: updatedReview})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

//  delete review by its id
export const deleteReviewController = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId ?? req.body.reviewId
    if (!reviewId) return res.json({message: "Review id required"})

    const ifReviewIdExist = await getGuestByIdService(reviewId)
    if (!ifReviewIdExist) return res.status(404).json({message: "Review does not exist"})

    const deletedReview = await deleteReviewService(reviewId)
    if (!deletedReview) return res.status(400).json({message: "Unable to delete review"})
      return res.status(200).json({message: "Review was successfully deleted"})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};