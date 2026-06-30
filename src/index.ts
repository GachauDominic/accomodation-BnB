import { eq } from "drizzle-orm";
import db from "./Drizzle/db";
import { guestsTable, reviewsTable, TIGuest } from "./Drizzle/schema";
import { randomUUID } from "node:crypto";

// const getAllGuests = async () => {
//   return await db.query.guestsTable.findMany()
// };

// const getGuestByRoom = async (guestRoom: string) => {
//   return await db.query.guestsTable.findFirst({
//     where: eq(guestsTable.guestRoomNumber, guestRoom), 
//   })
// }

// // customer with review by guest id
// const getCustomerReview = async (guestId: string) => {
//   return await db.query.guestsTable.findFirst({
//     where: eq(guestsTable.guestId, guestId),
//     with: {
//       guestReviews: true,
//     },
//   })
// };
// SELECT
//   g.*,
//   r.*
// FROM guests AS g
// LEFT JOIN reviews AS r
//   ON r.reviewGuestId = g.guestId
// WHERE g.guestId = $1;

// review details joined with guest and room data
// const getReviewDetails = async (reviewId: string) => {
//   return await db.query.reviewsTable.findFirst({
//     where: eq(reviewsTable.reviewId, reviewId),
//     with: {
//       reviewGuest: true,
//       reviewRoom: true,
//       revieWBooking: true,
//     },
//   })
// };
// SELECT
//   rv.*,
//   g.*,
//   rm.*,
//   b.*
// FROM reviews AS rv
// LEFT JOIN guests AS g
//   ON g.guestId = rv.reviewGuestId
// LEFT JOIN rooms AS rm
//   ON rm.roomNumber = rv.reviewRoomNum
// LEFT JOIN bookings AS b
//   ON b.bookingId = rv.reviewBookingId
// WHERE rv.reviewId = $1;

// const getCustomerReview = async (guestId: string) => {
//   return await db.query.guestsTable.findFirst({
//     where: eq(guestsTable.guestId, guestId),
//     with: {
//       guestReviews: {
//         columns: {
//           comment: true,
//           rating: true,
//         }
//       },
//     },
//   })
// };

// const newGuest = {
//    //the variable names must match as those in the DB/schema
//   guestId: randomUUID(),
//   guestfirstName: "Pauline",
//   guestlastName: "Ndichu",
//   guestContact: "0758753432",
// };

// const insertGuest = async (guest: TIGuest) => {
//   const insertedGuest = await db.insert(guestsTable).values(guest).returning();
//   return insertedGuest;
// };

// const updateGuest = async(contact: string, updatedData: Partial<TIGuest>)=>{
//   const updatedGuest = await db.update(guestsTable)
//   .set(updatedData)
//   .where(eq(guestsTable.guestContact, contact))
//   .returning()
//   return updatedGuest
// }

const deleteGuest = async (roomNum:string) => {
  const deletedGuest = await db.delete(guestsTable)
  .where(eq(guestsTable.guestRoomNumber, roomNum))
  .returning()
  return deletedGuest
}

async function main() {
  // const guests = await getAllGuests()
  // console.log("All availably guests are:", guests)

  // const guest = await getGuestByRoom("5A")
  // if (!guest) {
  //   console.log("The room is currently vacant.")
  // } else {
  //   console.log("Availably guest in the room:", guest)
  // }

  // const customerWithReview = await getCustomerReview("ea549854-d237-4737-aba3-a35579222286");
  // if (!customerWithReview) {
  //   console.log("Error!")
  // } else {
  //   console.log("Here's the data:", customerWithReview)
  // };

  //   const insertedGuest = await insertGuest(newGuest)
  //   if (!insertedGuest) {
  //     console.log("No new guest")
  //   } else {
  //     console.log("The new guest is:", insertedGuest[0])
  //   }

  //   const updatedGuest = await updateGuest("0758753432", {
  //     guestRoomNumber: "1A"
  //   })
  //   if (updatedGuest.length > 0) {
  //     console.log("Guest updated:", updatedGuest)
  //   } else {
  //     console.log("Unable to update guest!")
  //   }
  // }

  const deletedGuest = await deleteGuest("1A")
  if (deletedGuest.length > 0) {
    console.log("The guest was deleted successfully!")
  } else {
    console.log("Unable to delete customer")
  }


}

// invoke main()
main().catch((error) => {
  console.error("Error in the Main function", error);
  process.exit(1);
});
  