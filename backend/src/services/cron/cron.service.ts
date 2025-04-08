import { Service, Container } from 'typedi';
import { CronJob } from 'cron';
import Order, { EOrderStatus } from '@/models/order.model';
import Shipment, { EShipmentStatus } from '@/models/shipment.model';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import mongoose from 'mongoose';
import redis from 'src/config/redis';
import { ShipmentService } from '@/services/shipment/shipment.service';

@Service()
export class OrderCronService {
    private orderConfirmationJob: CronJob;
    private shipmentService: ShipmentService;
    
    // For testing: 3 minutes instead of 24 hours
    private readonly CONFIRMATION_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes in milliseconds
    // private readonly CONFIRMATION_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    constructor() {
        this.shipmentService = Container.get(ShipmentService);
        
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
                    
                    // Remove from tracking after processing - immediately dispose the job
                    await this.disposeOrderConfirmationJob(orderId);
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
            await this.disposeOrderConfirmationJob(orderId);
            console.log(`Cancelled scheduled confirmation for order ${orderId}`);
        } catch (error) {
            console.error(`Error cancelling confirmation for order ${orderId}:`, error);
        }
    }

    /**
     * Confirm an order by changing its status to confirmed and create shipments for each item
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
            
            // Create shipment records for items using the ShipmentService
            const shipmentsCreated = await this.shipmentService.createShipmentsForOrder(orderId);
            
            if (shipmentsCreated) {
                console.log(`Order ${orderId} automatically confirmed after timeout period with shipments created`);
            } else {
                console.error(`Order ${orderId} was confirmed but there was an issue creating the shipments`);
            }
        } catch (error) {
            console.error(`Error confirming order ${orderId}:`, error);
        }
    }

    /**
     * Dispose of a scheduled order confirmation job
     * This is used both for cancellations and after successful confirmations
     */
    public async disposeOrderConfirmationJob(orderId: string | mongoose.Types.ObjectId): Promise<void> {
        try {
            const orderIdStr = typeof orderId === 'string' ? orderId : orderId.toString();
            
            // Remove the order from Redis tracking
            await redis.getClient().del(`order_confirmation:${orderIdStr}`);
            
            console.log(`Disposed confirmation job for order ${orderIdStr}`);
        } catch (error) {
            console.error(`Error disposing confirmation job for order ${orderId}:`, error);
        }
    }

    /**
     * Dispose method to be called when the service is no longer needed
     * Useful for application shutdown
     */
    public dispose(): void {
        if (this.orderConfirmationJob) {
            this.orderConfirmationJob.stop();
            console.log('Order confirmation cron job stopped');
        }
    }
}