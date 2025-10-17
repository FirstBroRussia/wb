export type TarifsBoxWBPostgresTableRepopsitoryType = {
  id: number;
  created_at: string;
  updated_at: string;
  box_delivery_base: number | null;
  box_delivery_coef_expr: number | null;
  box_delivery_liter: number | null;
  box_delivery_marketplace_base: number | null;
  box_delivery_marketplace_coef_expr: number | null;
  box_delivery_marketplace_liter: number | null;
  box_storage_base: number | null;
  box_storage_coef_expr: number | null;
  box_storage_liter: number | null;
  geo_name: string;
  warehouse_name: string;
  record_date: Date;
};

export type TarifsBoxWBPostgresTableInsertRepositoryType = Omit<TarifsBoxWBPostgresTableRepopsitoryType, 'id' | 'created_at'| 'updated_at'>;
