export enum EUserRole {
  Customer = 'customer',
  StoreOwner = 'storeOwner',
  DeliveryPersonnel = 'deliveryPersonnel',
  DeliveryCompany = 'deliveryCompany',
  Admin = 'admin',
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginResult {
  authenticated: boolean;
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
  role: EUserRole;
  email: string;
}

export interface IRegisterInput {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  role: EUserRole;
  phoneNumber: string;
  addresses?: string[];
  avatarPicture?: string;
  vehicleLicenseNumber?: string;
}

export interface IRegisterResult {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  password: string;
  role: EUserRole;
  phoneNumber: string;
  addresses?: string[];
  avatarPicture?: string;
  vehicleLicenseNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserInfoApiParams {
  accessToken: string;
}

export interface IUserInfo  {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  password: string;
  role: EUserRole;
  phoneNumber: string;
  addresses?: string[];
  avatarPicture?: string;
  vehicleLicenseNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRefreshTokenResult {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthState {
  currentUser?: IUserInfo;
  isAuth: boolean;
}

export type TAuthActionType = 'logout' | 'setIsAuth' | 'setCurrentUser';
