import { Express } from "express";
import { createPaymentController, deletePaymentController, getAllPaymentsController, getPaymentByIdController, getPaymetByBookingIdController, updatepaymentController } from "./payments.controller";

const payments = (app: Express)=>{
  // create payment
  app.route("/payments/createpayment").post(async (req, res, next) => {
    try {
      await createPaymentController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get all payments
  app.route("/auth/payments").get(async (req, res, next) => {
    try {
      await getAllPaymentsController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get payment by its id
  app.route("/auth/payments/getpaymentbyid/:paymentId").get(async (req, res, next) => {
    try {
      await getPaymentByIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get payment by booking id
  app.route("/auth/payments/getpaymentbybookingid/:bookingId").get(async (req, res, next) => {
    try {
      await getPaymetByBookingIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // update a payment by paymentId
  app.route("/auth/payments/update/:paymentId").patch(async (req, res, next) => {
    try {
      await updatepaymentController(req, res)
    } catch (error) {
      next(error)
    }
  });

  //  delete a paymentby paymentId
  app.route("/auth/payments/delete/:paymentId").delete(async (req, res, next) => {
    try {
      await deletePaymentController(req, res)
    } catch (error) {
      next(error)
    }
  })
}
export default payments