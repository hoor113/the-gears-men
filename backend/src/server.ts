import { AuthController } from '@/controllers/auth.controller';
import { UserController } from '@/controllers/user.controller';
import { CustomerController } from '@/controllers/customer/customer.controller';
import { StoreOwnerController } from '@/controllers/store-owner/store-owner.controller';
import { DeliveryCompanyController } from '@/controllers/delivery-company/delivery-company.controller';
import { DeliveryPersonnelController } from '@/controllers/delivery-personnel/delivery-personnel.controller';

import { App } from './app';

const controllers = [
    AuthController,
    UserController,
    CustomerController,
    StoreOwnerController,
    DeliveryCompanyController,
    DeliveryPersonnelController
];

const app = new App(controllers);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
app.listen(PORT);
