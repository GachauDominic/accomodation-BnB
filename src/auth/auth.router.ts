//  the routes define the paths
import { Express} from "express";
import { createHostController,createGuestController } from "./auth.controller";

const host = (app: Express)=>{
  app.route("/auth/register").post(
    async (req, res, next) => {
      try{
        await createHostController(req, res)
      }catch(error){
        next(error)
      }
    }
  )
} 

const guest = (app: Express)=>{
  app.route("/user/register").post(
    async (req, res, next) => {
      try{
        await createGuestController(req, res)
      }catch(error){
        next(error)
      }
    }
  )
} 

export default host;
// export default guest;