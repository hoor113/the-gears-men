export enum EOrderStatus {
  WaitingForPayment = 'waiting_for_payment',
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
}
export enum EPaymentMethod {
  Card = 'card',
  Cash = 'cash',
  Zalopay = 'zalopay',
  Vnpay = 'vnpay',
}
