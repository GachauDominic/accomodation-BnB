//  the routes define the paths
import { Express} from "express";
import { createHostController, deleteHostController, getAllHostcontroller, loginHostController } from "./auth.controller";

const host = (app: Express)=>{
  // create host
  app.route("/auth/register").post(
    async (req, res, next) => {
      try{
        await createHostController(req, res)
      }catch(error){
        next(error)
      }
    }
  )

// get all hosts
  app.route("/auth/hosts/get").get(async (req, res, next) => {
    try {
      await getAllHostcontroller(req, res)
    } catch (error) {
      next(error)
    }
  })

// login host
  app.route("/auth/loginhost").post( 
    async (req, res, next) => {
      try{
        await loginHostController(req, res)
      }catch(error){
        next(error)
      }
    }
  )

  // delete host 
  app.route("/auth/hosts/delete/:hostAdminId").delete(async (req, res, next) => {
    try {
      await deleteHostController(req, res)
    } catch (error) {
      next(error)
    }
  });

  
};
export default host;