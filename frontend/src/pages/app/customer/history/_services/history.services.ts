import { BaseCrudService, TBaseResponse } from '@/base/base-crud-service';
import { IPaginatedItems } from '@/base/base.model';
import { httpService } from '@/base/http-service';
import { EOrderStatus } from '@/services/order/order.model';
import { EShipmentStatus } from '@/services/shipment/shipment.model';

// This maps to the backend model (raw data)
export interface IOrderItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
  shippingPrice: number;
  shipmentId?: {
    _id: string;
    status: EShipmentStatus;
    estimatedDelivery: string;
    deliveryDate?: string;
  };
  productDiscountCode?: {
    _id: string;
    code: string;
  };
  shippingDiscountCode?: {
    _id: string;
    code: string;
  };
}

// Raw order data from backend
interface IOrderRaw {
  _id: string;
  customerId: string;
  items: IOrderItem[];
  orderStatus: EOrderStatus;
  totalPrice: number;
  createdAt: string;
}

// Transformed data for frontend display
export interface IShipmentInfo {
  id: string;
  status: EShipmentStatus;
  estimatedDelivery: string;
  deliveryDate?: string;
  product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  };
  productDiscountCode?: string;
  shippingDiscountCode?: string;
  shippingPrice: number;
}

export interface IOrderHistoryItem {
  id: string;
  date: string;
  status: EOrderStatus;
  total: number;
  items: number;
  shipments: IShipmentInfo[];
}

export interface IOrderHistory extends IPaginatedItems<IOrderHistoryItem> {
  totalPages: number;
}

// Add this interface for pending orders
export interface IPendingOrderItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  price: number;
  shippingPrice: number;
  productDiscountCode?: {
    _id: string;
    code: string;
  };
  shippingDiscountCode?: {
    _id: string;
    code: string;
  };
}

export interface IPendingOrder {
  _id: string;
  createdAt: string;
  orderStatus: EOrderStatus;
  totalPrice: number;
  items: IPendingOrderItem[];
}

export interface IPendingOrderResponse extends IPaginatedItems<IPendingOrder> {
  totalPages: number;
}

// Transform the raw order data to the format expected by the frontend
function transformOrderData(orders: IOrderRaw[]): IOrderHistoryItem[] {
  if (!orders || !Array.isArray(orders)) {
    return [];
  }
  
  return orders.map((order) => {
    if (!order) return null;
    
    // Transform each order item to a shipment info
    const shipments = Array.isArray(order.items) ? order.items.map((item) => {
      if (!item) return null;
      
      const shipmentInfo: IShipmentInfo = {
        id: item.shipmentId?._id || `no-shipment-${item._id || 'unknown'}`,
        status: item.shipmentId?.status || EShipmentStatus.Pending,
        estimatedDelivery: item.shipmentId?.estimatedDelivery || order.createdAt || new Date().toISOString(),
        deliveryDate: item.shipmentId?.deliveryDate,
        product: {
          id: item.productId?._id || 'unknown',
          name: item.productId?.name || 'Unknown Product',
          price: item.price || 0,
          quantity: item.quantity || 0,
          imageUrl: item.productId?.images?.[0] || undefined,
        },
        productDiscountCode: item.productDiscountCode?.code,
        shippingDiscountCode: item.shippingDiscountCode?.code,
        shippingPrice: item.shippingPrice || 0,
      };
      return shipmentInfo;
    }).filter(Boolean) : [];

    return {
      id: order._id || 'unknown',
      date: order.createdAt || new Date().toISOString(),
      status: order.orderStatus || EOrderStatus.Pending,
      total: order.totalPrice || 0,
      items: Array.isArray(order.items) ? order.items.length : 0,
      shipments: shipments,
    };
  }).filter(Boolean) as IOrderHistoryItem[];
}

class OrderHistoryService extends BaseCrudService {
  constructor() {
    super('/orders');
  }

  public async getOrderHistory(
    page: number,
    pageSize: number,
  ): Promise<IOrderHistory> {
    const res = await httpService.request<TBaseResponse<any>>({
      method: 'GET',
      url: `${this.basePath}/history`,
      params: {
        skipCount: (page - 1 || 0) * pageSize,
        maxResultCount: pageSize,
      },
    });
    // console.log('Order history data:', res);
    // Transform the data from backend format to frontend format
    const transformedItems = transformOrderData(res.result);
    const totalRecords = res.resultCount;

    console.log(totalRecords);
    console.log(Math.ceil(totalRecords / pageSize));

    return {
      items: transformedItems,
      totalPages: Math.ceil(totalRecords / pageSize),
      totalCount: totalRecords,
      totalRecords: totalRecords,
      data: transformedItems,
    };
  }

  public async getOrderDetail(orderId: string): Promise<IOrderHistoryItem> {
    const res = await httpService.request<TBaseResponse<IOrderRaw>>({
      method: 'GET',
      url: `${this.basePath}/${orderId}`,
    });

    // Transform the single order data
    const transformedOrder = transformOrderData([res.result])[0];
    return transformedOrder;
  }

  // New function to get orders by pending status
  public async getOrdersByStatus(
    page: number,
    pageSize: number,
    isPending: number,
  ): Promise<IPendingOrderResponse | IOrderHistory> {
    try {
      const res = await httpService.request<TBaseResponse<any>>({
        method: 'GET',
        url: `${this.basePath}/history`,
        params: {
          skipCount: (page - 1 || 0) * pageSize,
          maxResultCount: pageSize,
          isPending: isPending,
        },
      });

      // Log the response for debugging
      console.log(`API Response (isPending=${isPending}):`, res);

      const totalRecords = res?.resultCount || 0;
      const totalPages = Math.ceil(totalRecords / pageSize) || 1;

      // Ensure res.result is always an array
      const resultArray = Array.isArray(res?.result) ? res.result : [];

      if (isPending === 1) {
        // For pending orders, we return the data in the pending order format
        // This avoids transformation errors
        const orders = res.result || [];

        return {
          items: orders.map((order: any) => ({
            _id: order._id || '',
            createdAt: order.createdAt || new Date().toISOString(),
            orderStatus: order.orderStatus || EOrderStatus.Pending,
            totalPrice: order.totalPrice || 0,
            items: Array.isArray(order.items)
              ? order.items.map((item: any) => ({
                  _id: item._id || '',
                  productId: item.productId
                    ? {
                        _id: item.productId._id || '',
                        name: item.productId.name || 'Unknown Product',
                        price: item.productId.price || 0,
                        imageUrl: item.productId.images[0] || undefined,
                      }
                    : {
                        _id: '',
                        name: 'Unknown Product',
                        price: 0,
                      },
                  quantity: item.quantity || 1,
                  price: item.price || 0,
                  shippingPrice: item.shippingPrice || 0,
                  productDiscountCode: item.productDiscountCode,
                  shippingDiscountCode: item.shippingDiscountCode,
                }))
              : [],
          })),
          totalPages,
          totalCount: totalRecords,
          totalRecords,
          data: res.result || [],
        } as IPendingOrderResponse;
      } else {
        // For confirmed orders, use the regular transformation with additional safety
        try {
          const transformedItems = transformOrderData(resultArray);

          return {
            items: transformedItems,
            totalPages,
            totalCount: totalRecords,
            totalRecords,
            data: transformedItems,
          } as IOrderHistory;
        } catch (error) {
          console.error('Error transforming order data:', error);
          return {
            items: [],
            totalPages: 1,
            totalCount: 0,
            totalRecords: 0,
            data: [],
          } as IOrderHistory;
        }
      }
    } catch (error) {
      console.error('Error in getOrdersByStatus:', error);
      return isPending === 1 
        ? { items: [], totalPages: 1, totalCount: 0, totalRecords: 0, data: [] } as IPendingOrderResponse
        : { items: [], totalPages: 1, totalCount: 0, totalRecords: 0, data: [] } as IOrderHistory;
    }
  }

  // Get pending orders (convenience method)
  public async getPendingOrders(
    page: number,
    pageSize: number,
  ): Promise<IPendingOrderResponse> {
    return this.getOrdersByStatus(
      page,
      pageSize,
      1,
    ) as Promise<IPendingOrderResponse>;
  }

  // Get confirmed orders (convenience method)
  public async getConfirmedOrders(
    page: number,
    pageSize: number,
  ): Promise<IOrderHistory> {
    try {
      const result = await this.getOrdersByStatus(page, pageSize, 0) as IOrderHistory;
      console.log('Confirmed orders result:', result);
      
      // Ensure we have a valid response object even if something is missing
      return {
        items: Array.isArray(result.items) ? result.items : [],
        totalPages: result.totalPages || 1,
        totalCount: result.totalCount || 0,
        totalRecords: result.totalRecords || 0,
        data: Array.isArray(result.data) ? result.data : [],
      };
    } catch (error) {
      console.error('Error in getConfirmedOrders:', error);
      // Return empty data structure on error
      return {
        items: [],
        totalPages: 1,
        totalCount: 0,
        totalRecords: 0,
        data: [],
      };
    }
  }

  // If needed: cancel an order
  public async cancelOrder(orderId: string): Promise<TBaseResponse<any>> {
    return httpService.request<TBaseResponse<any>>({
      method: 'POST',
      url: `${this.basePath}/cancel`,
      data: {
        orderId,
      },
    });
  }
}

const orderHistoryService = new OrderHistoryService();

export default orderHistoryService;
