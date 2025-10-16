export type WBApiResponseType<T = any> = {
  response: {
    data: WBApiDataResponseType<T>;
  };
};

export type WBApiDataResponseType<T> = {
  dtNextBox: string; // формат YYYY-MM-DD
  dtTillMax: string; // формат YYYY-MM-DD
  warehouseList: T[];
};

export type WBWarehouseTarifsBoxType = {
  boxDeliveryBase: string;
  boxDeliveryCoefExpr: string;
  boxDeliveryLiter: string;
  boxDeliveryMarketplaceBase: string;
  boxDeliveryMarketplaceCoefExpr: string;
  boxDeliveryMarketplaceLiter: string;
  boxStorageBase: string;
  boxStorageCoefExpr: string;
  boxStorageLiter: string;
  geoName: string;
  warehouseName: string;
};
