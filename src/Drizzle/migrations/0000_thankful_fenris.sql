CREATE TYPE "public"."bookingStatusEnum" AS ENUM('vacant', 'assigned');--> statement-breakpoint
CREATE TYPE "public"."paymentMethodEnum" AS ENUM('cash', 'creditCard', 'MPesa_paybill');--> statement-breakpoint
CREATE TYPE "public"."paymentStatusEnum" AS ENUM('unpaid', 'pending', 'confirmed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."roomApprovalEnum" AS ENUM('approved', 'pending', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."roomStatusEnum" AS ENUM('vacant', 'booked', 'occupied');--> statement-breakpoint
CREATE TYPE "public"."userRoleEnum" AS ENUM('hostAdmin', 'guest');--> statement-breakpoint
CREATE TABLE "bookings" (
	"bookingId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bookingRoomId" varchar NOT NULL,
	"bookingGuestId" uuid,
	"checkinDate" timestamp NOT NULL,
	"checkoutDate" timestamp NOT NULL,
	"guestCount" integer NOT NULL,
	"totalAmount" numeric(10, 2) NOT NULL,
	"bookingStatus" "bookingStatusEnum" NOT NULL,
	"bookingDate" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"guestId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guestRoomNumber" varchar,
	"guestFirstName" varchar(50) NOT NULL,
	"guestLastName" varchar(50) NOT NULL,
	"guestContact" text NOT NULL,
	"role" "userRoleEnum" DEFAULT 'guest' NOT NULL,
	"guestEmail" varchar(100) NOT NULL,
	"guestPassword" varchar(255) NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	"verificationCode" varchar(10),
	CONSTRAINT "guests_guestContact_unique" UNIQUE("guestContact")
);
--> statement-breakpoint
CREATE TABLE "hosts" (
	"hostAdminId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" varchar(50) NOT NULL,
	"lastName" varchar(50) NOT NULL,
	"hostEmail" varchar(100) NOT NULL,
	"hostContact" text NOT NULL,
	"hostPasswordHash" varchar(255) NOT NULL,
	"role" "userRoleEnum" DEFAULT 'hostAdmin' NOT NULL,
	CONSTRAINT "hosts_hostContact_unique" UNIQUE("hostContact")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"paymentId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"paymentBookingId" uuid NOT NULL,
	"paymentMethod" "paymentMethodEnum" NOT NULL,
	"paymentStatus" "paymentStatusEnum" NOT NULL,
	"paymentDate" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"reviewId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reviewBookingId" uuid NOT NULL,
	"reviewRoomNum" varchar NOT NULL,
	"reviewGuestId" uuid NOT NULL,
	"reviewRating" integer,
	"reviewComment" text,
	"reviewCreatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roomApproval" (
	"approvalId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"approvedRoomNum" varchar NOT NULL,
	"approvingHostId" uuid NOT NULL,
	"approvedGuestId" uuid NOT NULL,
	"roomApprovalStatus" "roomApprovalEnum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"roomNumber" varchar PRIMARY KEY NOT NULL,
	"roomDescription" varchar NOT NULL,
	"address" text NOT NULL,
	"maxGuest" integer NOT NULL,
	"pricePerNight" numeric(10, 2) NOT NULL,
	"roomStatus" "roomStatusEnum" DEFAULT 'vacant' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_bookingRoomId_rooms_roomNumber_fk" FOREIGN KEY ("bookingRoomId") REFERENCES "public"."rooms"("roomNumber") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_bookingGuestId_guests_guestId_fk" FOREIGN KEY ("bookingGuestId") REFERENCES "public"."guests"("guestId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_guestRoomNumber_rooms_roomNumber_fk" FOREIGN KEY ("guestRoomNumber") REFERENCES "public"."rooms"("roomNumber") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_paymentBookingId_bookings_bookingId_fk" FOREIGN KEY ("paymentBookingId") REFERENCES "public"."bookings"("bookingId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewBookingId_bookings_bookingId_fk" FOREIGN KEY ("reviewBookingId") REFERENCES "public"."bookings"("bookingId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewRoomNum_rooms_roomNumber_fk" FOREIGN KEY ("reviewRoomNum") REFERENCES "public"."rooms"("roomNumber") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewGuestId_guests_guestId_fk" FOREIGN KEY ("reviewGuestId") REFERENCES "public"."guests"("guestId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roomApproval" ADD CONSTRAINT "roomApproval_approvedRoomNum_rooms_roomNumber_fk" FOREIGN KEY ("approvedRoomNum") REFERENCES "public"."rooms"("roomNumber") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roomApproval" ADD CONSTRAINT "roomApproval_approvingHostId_hosts_hostAdminId_fk" FOREIGN KEY ("approvingHostId") REFERENCES "public"."hosts"("hostAdminId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roomApproval" ADD CONSTRAINT "roomApproval_approvedGuestId_guests_guestId_fk" FOREIGN KEY ("approvedGuestId") REFERENCES "public"."guests"("guestId") ON DELETE cascade ON UPDATE no action;