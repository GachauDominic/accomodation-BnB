import { randomUUID } from "node:crypto";
import db from "./db";
import { bookingsTable, guestsTable, hostAdminTable, paymentsTable, reviewsTable, roomApprovalTable, roomsTable } from "./schema";

// CRUD OPERATIONS
// C - CREATE
// R - READ
// U - UPDATE
// D - DELETE
async function seed() {
  console.log("Seeding the DataBase started...");

  try {
    // Generate UUIDs for later reference
    const hostAdminId = randomUUID();
    const guestId1 = randomUUID();
    const guestId2 = randomUUID();
    const guestId3 = randomUUID();
    const bookingId1 = randomUUID();
    const bookingId2 = randomUUID();
    const bookingId3 = randomUUID();

    // {hostAdmin insertion}
    await db.insert(hostAdminTable).values([
      {
        hostAdminId: hostAdminId,
        firstName: "Dominic",
        lastName: "Maina",
        hostEmail: "dommaina@example.com",
        hostContact: "0712345678",
        hostPasswordHash: "password123"
      }
    ]);

    // {rooms insertion}
    await db.insert(roomsTable).values([
      {
        roomNumber: "1A",
        roomDescription: "Bedsitter: one bathroom, one bed, dinner and breakfast included",
        address: "Pamki Building, Kimathi way Nyeri down town",
        maxGuest: 2,
        pricePerNight: "1500.00"
      },
      {
        roomNumber: "2A",
        roomDescription: "Bedsitter: one bathroom, dinner and breakfast included",
        address: "Pamki Building, Kimathi way Nyeri down town",
        maxGuest: 2,
        pricePerNight: "1500.00"
      },
      {
        roomNumber: "3A",
        roomDescription: "One bedroom: one bathroom, one dinning room, dinner and breakfast included",
        address: "Pamki Building, Kimathi way Nyeri down town",
        maxGuest: 3,
        pricePerNight: "2000.00"
      },
      {
        roomNumber: "4A",
        roomDescription: "One bedroom: one bathroom, one dinning room, dinner and breakfast included",
        address: "Pamki Building, Kimathi way Nyeri down town",
        maxGuest: 3,
        pricePerNight: "2000.00",
        roomstatus: "booked"
      },
      {
        roomNumber: "5A",
        roomDescription: "Bedsitter: one bathroom, one bed, dinner and breakfast included",
        address: "Pamki Building, Kimathi way Nyeri down town",
        maxGuest: 2,
        pricePerNight: "1500.00",
        roomstatus: "occupied"
      },
      {
        roomNumber: "6A",
        roomDescription: "Two bedroom: one bathroom, one bedrooms, one dinning room, dinner and breakfast included",
        address: "Pamki Building, Kimathi way Nyeri down town",
        maxGuest: 2,
        pricePerNight: "3500.00",
        roomstatus: "occupied"
      }
    ]);

    // {guests insertion}
    await db.insert(guestsTable).values([
      {
        guestId: guestId1,
        guestFirstName: "John",
        guestLastName: "Kiai",
        guestContact: "0795063598",
        guestEmail: "johnkiai@example.com",
        guestPassword: "jkiai@123"

      },
      {
        guestId: guestId2,
        guestFirstName: "Mitch",
        guestLastName: "Nduta",
        guestContact: "0725638931",
        guestEmail: "mnduta@example.com",
        guestPassword: "mnduta@123"

      },
      {
        guestId: guestId3,
        guestFirstName: "John",
        guestLastName: "Kiamba",
        guestContact: "0747892890",
        guestEmail: "johnkiamba@example.com",
        guestPassword: "jkiamba@123"
      }
    ]);

    // {bookings insertion}
    // await db.insert(bookingsTable).values([
    //   {
    //     bookingId: bookingId1,
    //     bookingRoomNumber: "4A",
    //     bookingGuestId: guestId2,
    //     checkinDate: new Date("2026-05-06"),
    //     checkoutDate: new Date("2026-05-09"),
    //     guestCount: 1,
    //     totalAmount: "4500.00",
    //     bookingStatus: "vacant",
    //     bookingDate: new Date("2026-05-05")
    //   },
    //   {
    //     bookingId: bookingId2,
    //     bookingRoomNumber: "5A",
    //     bookingGuestId: guestId1,
    //     checkinDate: new Date("2026-06-10"),
    //     checkoutDate: new Date("2026-06-12"),
    //     guestCount: 1,
    //     totalAmount: "3000.00",
    //     bookingStatus: "assigned",
    //     bookingDate: new Date("2026-06-09")
    //   },
    //   {
    //     bookingId: bookingId3,
    //     bookingRoomNumber: "6A",
    //     bookingGuestId: guestId3,
    //     checkinDate: new Date("2026-07-01"),
    //     checkoutDate: new Date("2026-07-03"),
    //     guestCount: 1,
    //     totalAmount: "7000.00",
    //     bookingStatus: "assigned",
    //     bookingDate: new Date("2026-06-30")
    //   }
    // ]);

    // {payment insertion}
    // await db.insert(paymentsTable).values([
    //   {
    //     paymentBookingId: bookingId1,
    //     paymentMethod: "MPesa_paybill",
    //     paymentStatus: "confirmed",
    //     paymentDate: new Date("2026-05-05")
    //   },
    //   {
    //     paymentBookingId: bookingId2,
    //     paymentMethod: "MPesa_paybill",
    //     paymentStatus: "confirmed",
    //     paymentDate: new Date("2026-06-09")
    //   },
    //   {
    //     paymentBookingId: bookingId3,
    //     paymentMethod: "cash",
    //     paymentStatus: "confirmed",
    //     paymentDate: new Date("2026-06-30")
    //   }
    // ]);

    // {reviews insertion}
    // await db.insert(reviewsTable).values([
    //   {
    //     reviewBookingId: bookingId2,
    //     reviewRoomNum: "5A",
    //     reviewGuestId: guestId1,
    //     reviewRating: 3,
    //     reviewComment: "The experience was great"
    //   },
    //   {
    //     reviewBookingId: bookingId3,
    //     reviewRoomNum: "6A",
    //     reviewGuestId: guestId3,
    //     reviewRating: 3,
    //     reviewComment: "The experience was great. I loved it"
    //   }
    // ]);

    // {approvals insertion}
    // await db.insert(roomApprovalTable).values([
    //   {
    //     approvedRoomNum: "4A",
    //     approvingHostId: hostAdminId,
    //     approvedGuestId: guestId2,
    //     roomAprovalStatus: "pending"
    //   },
    //   {
    //     approvedRoomNum: "5A",
    //     approvingHostId: hostAdminId,
    //     approvedGuestId: guestId1,
    //     roomAprovalStatus: "approved"
    //   },
    //   {
    //     approvedRoomNum: "6A",
    //     approvingHostId: hostAdminId,
    //     approvedGuestId: guestId3,
    //     roomAprovalStatus: "approved"
    //   }
    // ]);

    console.log("Seeding the DB completed successfully");
    process.exit(0); // 0 => success
  } catch (error) {
    console.error("Error seeding the DataBase", error);
    process.exit(1); // 1 => error occurred
  }
}

// Invoke the function seed()
seed();
