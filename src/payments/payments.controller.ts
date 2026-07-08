import { Request, Response } from "express"
import { createPaymentService, deletePaymentService, getAllPaymentsService, getPaymentByBookingIdService, getPaymentByIdService, updatePaymentByIdService } from "./payments.service"
import { getBookingByIdController } from "../bookings/booking.controller";
import { getBookingByIdService } from "../bookings/booking.service";

// create a payment
export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const payment = req.body
    const createdPayment = await createPaymentService(payment)
    if (!createdPayment) return res.json({message: "Unable to create and complete the payment!!"})
      return res.status(201).json({message: "Payment created successfully", data: createdPayment})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// get all payments
export const getAllPaymentsController = async (req: Request, res: Response) => {
  try {
    const payments = await getAllPaymentsService()
    if (!payments || payments.length===0) return res.status(404).json({message: "No available payments"})
      return res.status(200).json({data: payments})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

//  get payment by its id
export const getPaymentByIdController = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.paymentId ?? req.body.paymentId
    if (!paymentId) return res.status(400).json({message: "Payment Id is required"})
    
    const payment = await getPaymentByIdService(paymentId)
    if (!payment) return res.status(404).json({message: "Payment not found!"})
      return res.status(200).json({data: payment})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// get payment by booking id
export const getPaymetByBookingIdController = async (req: Request, res:Response) => {
  try {
    const bookingId = req.params.bookingId ?? req.body.bookingId
    if (!bookingId) return res.status(400).json({message: "Booking Id is required"})

    const ifExistingBookingId = await getBookingByIdService(bookingId)
    if (!ifExistingBookingId) return res.status(404).json({message: "Booking not found!!"})
    
    const payment = await getPaymentByBookingIdService(bookingId)
    if (!payment) return res.status(404).json({message: "Payment not found!"})
      return res.status(200).json({data: payment})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// update payment by its Id
export const updatepaymentController = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.paymentId ?? req.body.paymentId
    if (!paymentId) return res.status(400).json({message: "Payment id is required"})
      
    const payment = req.body
    //convert paymentDate to a Date Object if provided
    if (payment.paymentDate) {
      payment.paymentDate = new Date(payment.paymentDate)
    }
    
    const ifpaymentExist = await getPaymentByIdService(paymentId)
    if (!ifpaymentExist) return res.status(404).json({message: "Booking not found"})

    const updatedPayment = await updatePaymentByIdService(paymentId, payment)
    if (!updatedPayment) return res.status(400).json({message: "Unable to update the payment"})
      return res.status(200).json({message: "Payment was successfully updated", data: payment})
  } catch (error: any) {
    return res.status(500).json({erro: error.message})
  }
};

//  delete a payment by its id
export const deletePaymentController = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.paymentId ?? req.body.paymentId
    if (!paymentId) return res.status(400).json({message: "Payment Id is required"})

    const ifExistingPaymentId = await getPaymentByIdService(paymentId)
    if (!ifExistingPaymentId) return res.status(404).json({message: "Payment not found!!"})

    const deletedPayment = await deletePaymentService(paymentId)
    if (!deletedPayment) return res.status(400).json({message: "Payment not deleted!"})
      return res.status(200).json({message: "Payment was successfully deleted"})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};