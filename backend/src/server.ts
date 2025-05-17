import { App } from '@/app';
import { AuthController } from '@/controllers/auth.controller';
import { UserController } from '@/controllers/user.controller';
import { OrderController } from '@/controllers/order.controller';
import { ProductController } from '@/controllers/product.controller';
import { StoreController } from '@/controllers/store.controller';
import { FileController } from '@/controllers/file.controller';
import { DiscountCodeController } from '@/controllers/discount-code.controller';
import { ShipmentController } from '@/controllers/shipment.controller';
import connectDB from '@/config/database';

async function startServer() {
    try {
        await connectDB(); // ✨ connect DB trước
        const controllers = [
            AuthController,
            UserController,
            OrderController,
            ProductController,
            StoreController,
            FileController,
            DiscountCodeController,
            ShipmentController,
        ];
        const app = new App(controllers);
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;
        app.listen(port); // ✨ sau khi connectDB thành công mới listen
    } catch (error) {
        console.error('❌ Server startup failed:', error);
        process.exit(1);
    }
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const controllers = [
    AuthController,
    UserController /* Add more controllers here */,
];
=======
const controllers = [AuthController, UserController, FileController];
>>>>>>> e65dd44d474f28c07dc6c6d97dd41a4f565a984c
=======
const controllers = [
    AuthController,
    UserController,
    OrderController,
    ProductController,
    StoreController,
    FileController,
    DiscountCodeController,
    ShipmentController,
];
>>>>>>> e246fa2b273ba2562f731ef3577a964ddd43f150

const app = new App(controllers);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;
app.listen(port);
=======
startServer();
>>>>>>> bf65217a05eb98c5454a1834052969877dd3060e
