import { IUserInfo } from "../auth/auth.model";

export interface IAbpConfiguration {
  roleId: number;
  roleName: string;
  auth: {
    allPermissions: any;
    grantedPermissions: any;
  };
}

export interface IAbpState {
  permissions: string[];
  curLoginInfo?: IUserInfo;
}


export type TAbpActionType = 'setPermissions' | 'setCurLoginInfo';
