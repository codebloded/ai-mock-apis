/* eslint-disable @typescript-eslint/no-explicit-any */

import { type ColumnDef } from "@tanstack/react-table";

export type StringFilterRule =
  | "contains"
  | "equals"
  | "startsWith"
  | "endsWith";
export type NumberFilterRule =
  | "equals"
  | "greaterThan"
  | "lessThan"
  | "between";
export type IDFilterRule = "equals" | "contains";

export type FilterType = "input" | "select" | "number" | "id" | "date";

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterConfig = {
  id: string;
  type: FilterType;
  placeholder: string;
  options?: FilterOption[];
  rules?: StringFilterRule[] | NumberFilterRule[] | IDFilterRule[];
};

export interface DynamicFilter extends FilterConfig {
  rule: string;
  value: string | number | string[] | any;
  secondValue?: string | number;
}

export type ColumnConfig = {
  filterType?: FilterType;
  filterRules?: StringFilterRule[] | NumberFilterRule[] | IDFilterRule[];
  minValue?: number;
  maxValue?: number;
};

export type DynamicDataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  filterConfig?: FilterConfig[];
  additionalActions?: React.ReactNode;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  className?: string;
  onCreateClick?: () => void;
};
