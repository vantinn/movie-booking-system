import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { routerAdmin, routerUser, routerPublic } from './routes';
import { errorHandler } from './middleware/error-handler.middleware';
import cookieParser from "cookie-parser";
import 'module-alias/register';
import "./utils/booking-cron";
import bodyParser from "body-parser";
import { PaymentController } from "./controllers/user/payment-int.controller";

dotenv.config();

const app = express();
app.use(morgan('dev'));

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));


app.post(
    "/api/user/paymentInt/webhook",
    bodyParser.raw({ type: "application/json" }),
    PaymentController.stripeWebhook
);

app.use(cookieParser());

app.use(express.json());


app.use('/api/public', routerPublic);

app.use('/api/user', routerUser);

app.use('/api/admin', routerAdmin);

app.use(errorHandler);

export default app;


