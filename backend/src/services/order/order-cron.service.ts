import { Service } from 'typedi';
import { CronJob } from 'cron';
import Order, { EOrderStatus } from '@/models/order.model';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import mongoose from 'mongoose';
import redis from 'src/config/redis';

@Service()
export class OrderCronService {
    private orderConfirmationJob: CronJob;
    
    // For testing: 3 minutes instead of 24 hours
    private readonly CONFIRMATION_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes in milliseconds
    // private readonly CONFIRMATION_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    constructor() {
        // Run every minute to check for orders that need confirmation (more frequent for testing)
        this.orderConfirmationJob = new CronJob('* * * * *', async () => {
            await this.processOrderConfirmations();
        });
        
        // Original cron expression for production
        // this.orderConfirmationJob = new CronJob('0 * * * *', async () => {
        //     await this.processOrderConfirmations();
        // });
        
        this.orderConfirmationJob.start();
        console.log('🕒 Order confirmation cron job started (TEST MODE: 3 minutes timeout)');
    }

    /**
     * Process all order confirmations that are due
     */
    private async processOrderConfirmations(): Promise<void> {
        try {
            const now = new Date();
            console.log(`Running order confirmation job at ${now.toISOString()}`);
            
            // Get all order IDs that are due for confirmation from Redis
            const keys = await redis.getClient().keys('order_confirmation:*');
            
            for (const key of keys) {
                const orderId = key.split(':')[1];
                const confirmationTime = await redis.get(key);
                
                if (!confirmationTime) continue;
                
                const confirmationTimeMs = parseInt(confirmationTime);
                if (now.getTime() >= confirmationTimeMs) {
                    // Time to confirm the order
                    await this.confirmOrder(orderId);
                    // Remove from tracking after processing
                    await redis.getClient().del(key);
                }
            }
        } catch (error) {
            console.error('Error processing order confirmations:', error);
        }
    }

    /**
     * Schedule an order for automatic confirmation
     */
    public async scheduleOrderConfirmation(orderId: string | mongoose.Types.ObjectId): Promise<void> {
        try {
            const orderIdStr = orderId.toString();
            const confirmationTime = new Date();
            
            // Set confirmation time to 3 minutes from now (for testing)
            confirmationTime.setTime(confirmationTime.getTime() + this.CONFIRMATION_TIMEOUT_MS);
            
            // For production: 24 hours from now
            // confirmationTime.setHours(confirmationTime.getHours() + 24);
            
            // Store the confirmation time in Redis with a TTL (5 minutes for testing, 25 hours for production)
            await redis.set(
                `order_confirmation:${orderIdStr}`, 
                confirmationTime.getTime().toString(),
                60 * 5 // 5 minutes TTL for testing
                // 60 * 60 * 25 // 25 hours TTL for production
            );
            
            console.log(`TEST MODE: Order ${orderIdStr} scheduled for confirmation at ${confirmationTime.toISOString()} (in 3 minutes)`);
            // console.log(`Order ${orderIdStr} scheduled for confirmation at ${confirmationTime.toISOString()}`);
        } catch (error) {
            console.error(`Error scheduling confirmation for order ${orderId}:`, error);
        }
    }

    /**
     * Cancel a scheduled order confirmation
     */
    public async cancelOrderConfirmation(orderId: string | mongoose.Types.ObjectId): Promise<void> {
        try {
            const orderIdStr = orderId.toString();
            // Remove from Redis to prevent auto-confirmation
            await redis.getClient().del(`order_confirmation:${orderIdStr}`);
            console.log(`Cancelled scheduled confirmation for order ${orderIdStr}`);
        } catch (error) {
            console.error(`Error cancelling confirmation for order ${orderId}:`, error);
        }
    }

    /**
     * Confirm an order by changing its status to confirmed
     */
    private async confirmOrder(orderId: string): Promise<void> {
        try {
            // Check if order is still in pending state (not cancelled)
            const order = await Order.findOne({ 
                _id: new mongoose.Types.ObjectId(orderId),
                orderStatus: EOrderStatus.Pending
            });
            
            if (!order) {
                console.log(`Order ${orderId} not found or not in pending state, skipping confirmation`);
                return;
            }
            
            // Update order status to confirmed
            order.orderStatus = EOrderStatus.Confirmed;
            await order.save();
            
            console.log(`Order ${orderId} automatically confirmed after timeout period`);
        } catch (error) {
            console.error(`Error confirming order ${orderId}:`, error);
        }
    }
}