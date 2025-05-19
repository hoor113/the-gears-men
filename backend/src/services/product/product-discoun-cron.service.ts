import { CronJob } from 'cron';
import redis from '@/config/redis';
import Product from '@/models/product.model';
import { DAILY_DISCOUNT_PERCENTAGE } from '@/constants/daily-discount-percentage';
import { Service } from 'typedi';

@Service()
export class ProductDiscountCronService {
    private dailyDiscountJob: CronJob;

    constructor() {
        // Test mode: Run every 2 minutes
        this.dailyDiscountJob = new CronJob('0 0 * * *', async () => {
            await this.runDailyDiscountJob();
        })
        // Prod mode: Run every day at midnight
        // this.dailyDiscountJob = new CronJob('0 * * * *', async() => {
        //     await this.runDailyDiscountJob();
        // })
        this.dailyDiscountJob.start();
    }

    public async runDailyDiscountJob(): Promise<void> {
        console.log('Running daily discount job at', new Date().toISOString());

        const productPool: string[] = await Product.find({}, { _id: 1 }).lean().then((products) => {
            return products.map((product) => product._id.toString())
        });
        // console.log('Product Pool:', productPool);
        let length = productPool.length < 5 ? productPool.length : 5;

        // Randomly select 5 products from the pool
        const selectedProducts = productPool.sort(() => 0.5 - Math.random()).slice(0, (length < 5 ? length : 5));
        console.log('Selected Products:', selectedProducts);
        if (await redis.getList('daily_discount') !== null) {
            await redis.del('daily_discount');
        }

        for (let i = 0; i < length; i++) {
            await redis.push(`daily_discount`, selectedProducts[i]);
        }
    }
}