import { Router } from "express";
import { PaymentController } from "../../controllers/user/payment-int.controller";
import bodyParser from "body-parser";

const router = Router();

router.post("/create-intent", PaymentController.createPaymentIntent); //use
export default router;


