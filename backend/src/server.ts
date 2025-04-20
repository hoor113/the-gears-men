import { AuthController } from '@/controllers/auth.controller';
import { UserController } from '@/controllers/user.controller';
import { OrderController } from '@/controllers/order.controller';
import { ProductController } from '@/controllers/product.controller';
import { StoreController } from '@/controllers/store.controller';
import { FileController } from '@/controllers/file.controller';
import { DiscountCodeController } from '@/controllers/discount-code.controller';
import { ShipmentController } from '@/controllers/shipment.controller';

import { App } from '@/app';

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
