// @flow
export type Handler = (e: any) => any;
export type anyObj = { [string]: any };
export type Label = {
  fieldName: string,
  forceLabel: string,
  isImp: boolean
};
export type Options = Array<any>;
