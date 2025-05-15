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
    imageUrl?: string;
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

// Transform the raw order data to the format expected by the frontend
function transformOrderData(orders: IOrderRaw[]): IOrderHistoryItem[] {
  return orders.map(order => {
    // Transform each order item to a shipment info
    const shipments = order.items.map(item => {
      const shipmentInfo: IShipmentInfo = {
        id: item.shipmentId?._id || `no-shipment-${item._id}`,
        status: item.shipmentId?.status || EShipmentStatus.Pending,
        estimatedDelivery: item.shipmentId?.estimatedDelivery || order.createdAt,
        deliveryDate: item.shipmentId?.deliveryDate,
        product: {
          id: item.productId._id,
          name: item.productId.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.productId.imageUrl,
        },
        productDiscountCode: item.productDiscountCode?.code,
        shippingDiscountCode: item.shippingDiscountCode?.code,
        shippingPrice: item.shippingPrice,
      };
      return shipmentInfo;
    });

    return {
      id: order._id,
      date: order.createdAt,
      status: order.orderStatus,
      total: order.totalPrice,
      items: order.items.length,
      shipments: shipments,
    };
  });
}

class OrderHistoryService extends BaseCrudService {
  constructor() {
    super('/orders');
  }

  public async getOrderHistory(
    page: number,
    pageSize: number
  ): Promise<IOrderHistory> {
    const res = await httpService.request<TBaseResponse<any>>({
      method: 'GET',
      url: `${this.basePath}/history`,
      params: {
        skipCount: page,
        maxResultCount: pageSize,
      }
    });

    // Transform the data from backend format to frontend format
    const transformedItems = transformOrderData(res.result.items || []);
    const totalRecords = res.result.totalRecords || 0;

    return {
      items: transformedItems,
      totalPages: Math.ceil(totalRecords / pageSize),
      totalCount: totalRecords,
      totalRecords: totalRecords,
      data: transformedItems
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
}

const orderHistoryService = new OrderHistoryService();

export default orderHistoryService;