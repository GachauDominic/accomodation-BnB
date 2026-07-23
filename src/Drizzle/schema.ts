import {
  boolean,
  decimal,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar
 } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

//Enums
// {user role enum}
export const userRoleEnum = pgEnum("userRoleEnum", ["hostAdmin", "guest"]);
// {room status enum}
export const roomStatusEnum = pgEnum("roomStatusEnum", ["vacant", "booked", "occupied"]);
// {booking status enum}
export const bookingStatusEnum = pgEnum("bookingStatusEnum", ["vacant", "assigned"]);
// {payment method enum}
export const paymentMethodEnum = pgEnum("paymentMethodEnum", ["cash", "creditCard", "MPesa_paybill",]);
// {payment status enum}
export const paymentStatusEnum = pgEnum("paymentStatusEnum", ["unpaid", "pending","confirmed", "refunded",]);
// {room approval enum}
export const roomApprovalEnum = pgEnum("roomApprovalEnum", ["approved", "pending", "rejected",]);


// Tables
//  {hostAdmin table}
export const hostAdminTable = pgTable("hosts", {
  hostAdminId: uuid("hostAdminId").primaryKey().defaultRandom().notNull(),
  firstName: varchar("firstName", {length: 50}).notNull(),
  lastName: varchar("lastName", {length: 50}).notNull(),
  hostEmail: varchar("hostEmail", {length: 100}).notNull(),
  hostContact: text("hostContact").notNull().unique(),
  hostPasswordHash: varchar("hostPasswordHash", {length: 255}).notNull(),
  role: userRoleEnum("role").default("hostAdmin").notNull(),
  // isVerified: boolean("isVerified").default(false),
  // verificationCode: varchar("verificationCode", {length: 10})
})
//  {rooms table}
export const roomsTable = pgTable("rooms", {
  roomNumber: varchar("roomNumber").primaryKey().notNull(),
  roomDescription: varchar("roomDescription").notNull(),
  address: text("address").notNull(),
  maxGuest: integer("maxGuest").notNull(),
  pricePerNight: decimal("pricePerNight", {precision: 10, scale:2}).notNull(),
  roomstatus: roomStatusEnum("roomStatus").notNull().default("vacant"),
})
//  {guests table}
export const guestsTable = pgTable("guests", {
  guestId: uuid("guestId").primaryKey().defaultRandom().notNull(),
  guestRoomNumber: varchar("guestRoomNumber").references(()=> roomsTable.roomNumber, {onDelete: "cascade"}),
  guestFirstName: varchar("guestFirstName", {length: 50}).notNull(),
  guestLastName: varchar("guestLastName", {length: 50}).notNull(),
  guestContact: text("guestContact").notNull().unique(),
  role: userRoleEnum("role").default("guest").notNull(),
  guestEmail: varchar("guestEmail", {length: 100}).notNull(),
  guestPassword: varchar("guestPassword", {length: 255}).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  verificationCode: varchar("verificationCode", {length: 10})
})
//  {bookings table}
export const bookingsTable = pgTable("bookings", {
  bookingId: uuid("bookingId").primaryKey().defaultRandom().notNull(),
  bookingRoomNumber: varchar("bookingRoomId").references(()=> roomsTable.roomNumber, {onDelete: "cascade"}).notNull(),
  bookingGuestId: uuid("bookingGuestId").references(()=> guestsTable.guestId, {onDelete: "cascade"}),
  checkinDate: timestamp("checkinDate").notNull(),
  checkoutDate: timestamp("checkoutDate").notNull(),
  guestCount: integer("guestCount").notNull(),
  totalAmount: decimal("totalAmount", {precision: 10, scale: 2}).notNull(),
  bookingStatus: bookingStatusEnum("bookingStatus").notNull(),
  bookingDate: timestamp("bookingDate").defaultNow().notNull(),
})
//  {payment table}
export const paymentsTable = pgTable("payments", {
  paymentId: uuid("paymentId").primaryKey().defaultRandom().notNull(),
  paymentBookingId: uuid("paymentBookingId").references(()=> bookingsTable.bookingId, {onDelete: "cascade"}).notNull(),
  paymentMethod: paymentMethodEnum("paymentMethod").notNull(),
  paymentStatus: paymentStatusEnum("paymentStatus").notNull(),
  paymentDate: timestamp("paymentDate").defaultNow().notNull(),
})
//  {reviews table}
export const reviewsTable = pgTable("reviews", {
  reviewId: uuid("reviewId").primaryKey().defaultRandom().notNull(),
  reviewBookingId: uuid("reviewBookingId").references(()=> bookingsTable.bookingId, {onDelete: "cascade"}).notNull(),
  reviewRoomNum: varchar("reviewRoomNum").references(()=> roomsTable.roomNumber, {onDelete: "cascade"}).notNull(),
  reviewGuestId: uuid("reviewGuestId").references(()=> guestsTable.guestId, {onDelete: "no action"}).notNull(),
  reviewRating: integer("reviewRating"),
  reviewComment: text("reviewComment"),
  reviewCreatedAt: timestamp("reviewCreatedAt").defaultNow(),
})
//  {room approval table}
export const roomApprovalTable = pgTable("roomApproval", {
  approvalId: uuid("approvalId").primaryKey().defaultRandom().notNull(),
  approvedRoomNum: varchar("approvedRoomNum").references(()=> roomsTable.roomNumber, {onDelete: "cascade"}).notNull(),
  approvingHostId: uuid("approvingHostId").references(()=> hostAdminTable.hostAdminId, {onDelete: "cascade"}).notNull(),
  approvedGuestId: uuid("approvedGuestId").references(()=> guestsTable.guestId, {onDelete: "cascade"}).notNull(),
  roomAprovalStatus: roomApprovalEnum("roomApprovalStatus").notNull(),
})


// Relations
// host 1:n rooms
// host 1:n roomApproval
export const hostRelations = relations(hostAdminTable, ({many}) => ({
  rooms: many(roomsTable),
  roomApprovalTable:  many(roomApprovalTable),
}));

// guest 1-n bookings
// guest 1-n reviews
// guest 1-1 room
export const guestRelations = relations(guestsTable, ({many, one}) => ({
  guestBookings: many(bookingsTable),
  guestReviews: many(reviewsTable),
  guestRoom: one(roomsTable, {
    fields: [guestsTable.guestId],
    references: [roomsTable.roomNumber],
  })
}));

// room 1-n bookings 
// room 1-n reviews
// room 1-1 approvalHost **
export const roomRelations = relations(roomsTable, ({many, one}) => ({
  roomBookings: many(bookingsTable),
  roomReviews: many(reviewsTable),
  approvingHost: one(hostAdminTable, //referenced table
    {
      fields: [roomsTable.roomNumber], // FK
      references: [hostAdminTable.hostAdminId] // PK referenced
    }),
}));

// bookings 1-n reviews
// bookings 1-1 room
// bookings 1-1 guest
export const bookingsRelations = relations(bookingsTable, ({many, one}) => ({
  roomBooking: one(roomsTable, {
    fields: [bookingsTable.bookingId],
    references: [roomsTable.roomNumber],
  }),
  guestBooking: one(guestsTable, {
    fields: [bookingsTable.bookingId],
    references: [guestsTable.guestId],
  }),
  reviewsBooking: many(reviewsTable),
}));

// payments 1-1 bookings
export const paymentRelations = relations(paymentsTable, ({one}) => ({
  paymentBooking: one(bookingsTable, {
    fields: [paymentsTable.paymentBookingId],
    references: [bookingsTable.bookingId],
  }),
}));

// reviews 1-1 booking
// reviews 1-1 guest
// reviews 1-1 room
export const reviewsRelations = relations(reviewsTable, ({one}) => ({
  revieWBooking: one(bookingsTable, //PK-Table
    { 
      fields: [reviewsTable.reviewBookingId], // FK
      references: [bookingsTable.bookingId] // PK
    }),
  reviewRoom: one(roomsTable, //PK-Table
    { 
      fields: [reviewsTable.reviewRoomNum], // FK
      references: [roomsTable.roomNumber] // PK
    }),
    reviewGuest: one(guestsTable, //PK-Table
    { 
      fields: [reviewsTable.reviewGuestId], // FK
      references: [guestsTable.guestId] // PK
    }),
}))

// approval 1-1 admin
// approval 1-1 room
// approval 1-1 guest
export const approvalRelations = relations(roomApprovalTable, ({one}) => ({
  approvedRoom: one(roomsTable, //PK-Table
    { 
      fields: [roomApprovalTable.approvedRoomNum], // FK
      references: [roomsTable.roomNumber] // PK
    }),
  approvedGuest: one(guestsTable, //PK-Table
    { 
      fields: [roomApprovalTable.approvedGuestId], // FK
      references: [guestsTable.guestId] // PK
    }),
    approvingHost: one(hostAdminTable, //PK-Table
    { 
      fields: [roomApprovalTable.approvingHostId], // FK
      references: [hostAdminTable.hostAdminId] // PK
    }),
}));

// {inferences}
export type TIHost = typeof hostAdminTable.$inferInsert 
export type TSHost = typeof hostAdminTable.$inferSelect

export type TIRoom = typeof roomsTable.$inferInsert
export type TSRoom = typeof roomsTable.$inferSelect

export type TIGuest = typeof guestsTable.$inferInsert
export type TSGuest = typeof guestsTable.$inferSelect

export type TIBooking = typeof bookingsTable.$inferInsert 
export type TSBooking = typeof bookingsTable.$inferSelect

export type TIPayment = typeof paymentsTable.$inferInsert
export type TSPayment = typeof paymentsTable.$inferSelect

export type TIReview = typeof reviewsTable.$inferInsert
export type TSReview = typeof reviewsTable.$inferSelect

export type TIApproval = typeof roomApprovalTable.$inferInsert 
export type TSApproval = typeof roomApprovalTable.$inferSelect

// // ============================================
// // HOST ADMIN RELATIONS
// // ============================================
// // Host has many Room Approvals (1:N)
// export const hostAdminRelations = relations(hostAdminTable, ({ many }) => ({
//   roomApprovals: many(roomApprovalTable),
// }));

// // ============================================
// // ROOMS RELATIONS
// // ============================================
// // Room has many Guests (1:N) - guests assigned to room
// // Room has many Bookings (1:N) - bookings for room
// // Room has many Reviews (1:N) - reviews for room
// // Room has many RoomApprovals (1:N) - approvals for room
// export const roomsRelations = relations(roomsTable, ({ many }) => ({
//   guests: many(guestsTable),
//   bookings: many(bookingsTable),
//   reviews: many(reviewsTable),
//   roomApprovals: many(roomApprovalTable),
// }));

// // ============================================
// // GUESTS RELATIONS
// // ============================================
// // Guest belongs to one Room (1:1)
// // Guest has many Bookings (1:N)
// // Guest has many Reviews (1:N)
// // Guest has many RoomApprovals (1:N) - approvals for guest
// export const guestsRelations = relations(guestsTable, ({ one, many }) => ({
//   room: one(roomsTable, {
//     fields: [guestsTable.guestRoomNumber],
//     references: [roomsTable.roomNumber],
//   }),
//   bookings: many(bookingsTable),
//   reviews: many(reviewsTable),
//   roomApprovals: many(roomApprovalTable),
// }));

// // ============================================
// // BOOKINGS RELATIONS
// // ============================================
// // Booking belongs to one Room (1:1)
// // Booking belongs to one Guest (0..1) - optional guest reference
// // Booking has one Payment (1:1) - one payment per booking
// // Booking has many Reviews (1:N)
// export const bookingsRelations = relations(bookingsTable, ({ one, many }) => ({
//   room: one(roomsTable, {
//     fields: [bookingsTable.bookingRoomNumber],
//     references: [roomsTable.roomNumber],
//   }),
//   guest: one(guestsTable, {
//     fields: [bookingsTable.bookingGuest],
//     references: [guestsTable.guestId],
//   }),
//   payment: one(paymentsTable),
//   reviews: many(reviewsTable),
// }));

// // ============================================
// // PAYMENTS RELATIONS
// // ============================================
// // Payment belongs to one Booking (1:1)
// export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
//   booking: one(bookingsTable, {
//     fields: [paymentsTable.paymentBookingId],
//     references: [bookingsTable.bookingId],
//   }),
// }));

// // ============================================
// // REVIEWS RELATIONS
// // ============================================
// // Review belongs to one Booking (1:1)
// // Review belongs to one Room (1:1)
// // Review belongs to one Guest (1:1)
// export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
//   booking: one(bookingsTable, {
//     fields: [reviewsTable.reviewBookingId],
//     references: [bookingsTable.bookingId],
//   }),
//   room: one(roomsTable, {
//     fields: [reviewsTable.reviewRoomNum],
//     references: [roomsTable.roomNumber],
//   }),
//   guest: one(guestsTable, {
//     fields: [reviewsTable.reviewGuestId],
//     references: [guestsTable.guestId],
//   }),
// }));

// // ============================================
// // ROOM APPROVAL RELATIONS
// // ============================================
// // RoomApproval belongs to one Room (1:1)
// // RoomApproval belongs to one Host (1:1)
// // RoomApproval belongs to one Guest (1:1)
// export const roomApprovalRelations = relations(
//   roomApprovalTable,
//   ({ one }) => ({
//     room: one(roomsTable, {
//       fields: [roomApprovalTable.approvedRoomNum],
//       references: [roomsTable.roomNumber],
//     }),
//     host: one(hostAdminTable, {
//       fields: [roomApprovalTable.approvingHostId],
//       references: [hostAdminTable.hostAdminId],
//     }),
//     guest: one(guestsTable, {
//       fields: [roomApprovalTable.approvedGuestId],
//       references: [guestsTable.guestId],
//     }),
//   })
// );
