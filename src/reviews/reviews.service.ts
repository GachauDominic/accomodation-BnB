import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { reviewsTable, roomsTable, TIReview } from "../Drizzle/schema";

// create review
export const createReviewService = async (review: TIReview) => {
  const newReview = await db.insert(reviewsTable).values(review).returning()
  return "Review created"
};

// get all reviews
export const getAllReviewsService = async () => {
  const reviews = await db.query.reviewsTable.findMany()
  return reviews
};

// get review by its id
export const getReviewByIdService = async (reviewId: string) => {
  const review = db.query.reviewsTable.findFirst({where: eq(reviewsTable.reviewId, reviewId)})
  return review
};

// get review by room number
export const getReviewByRoomNumService = async (roomNum: string) => {
  const [review] = await db.select({
    "reviewId": reviewsTable.reviewId,
    "reviewBookingId": reviewsTable.reviewBookingId,
    "reviewRoomNum": reviewsTable.reviewRoomNum,
    "reviewGuestId": reviewsTable.reviewGuestId,
    "reviewRating": reviewsTable.reviewRating,
    "reviewComment": reviewsTable.reviewComment,
  })
  .from(reviewsTable)
  .innerJoin(roomsTable, eq(reviewsTable.reviewRoomNum, roomsTable.roomNumber))
  .where(eq(reviewsTable.reviewRoomNum, roomNum))
  return review
};

// update review by its id
export const updateReviewByIdService = async (reviewId: string, updateReview:Partial<TIReview>) => {
  const updatedReview = await db.update(reviewsTable)
  .set(updateReview)
  .where(eq(reviewsTable.reviewId, reviewId))
  .returning()
  return updatedReview
};

// update review by guest id
export const updateReviewByGuestIdService = async (guestId: string, updateReview:Partial<TIReview>) => {
  const updatedReview = await db.update(reviewsTable)
  .set(updateReview)
  .where(eq(reviewsTable.reviewGuestId, guestId))
  .returning()
  return updatedReview
};

// delete review by its id
export const deleteReviewService = async (reviewId: string) => {
  await db.delete(reviewsTable).where(eq(reviewsTable.reviewId, reviewId))
  return "Review was deleted successfully"
}