export interface IContextAction<T, P = any> {
  type: T;
  payload?: P;
}
