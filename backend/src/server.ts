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
import { ZalopayController } from './controllers/zalopay.controller';

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
            ZalopayController,
        ];
        const app = new App(controllers);
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;
        app.listen(port); // ✨ sau khi connectDB thành công mới listen
    } catch (error) {
        console.error('❌ Server startup failed:', error);
        process.exit(1);
    }
}

startServer();
