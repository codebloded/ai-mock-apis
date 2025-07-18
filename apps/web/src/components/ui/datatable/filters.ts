/* eslint-disable @typescript-eslint/no-explicit-any */

import { type FilterFn } from "@tanstack/react-table";
import {
  type RankingInfo,
  rankings,
  rankItem,
} from "@tanstack/match-sorter-utils";

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
    number: FilterFn<unknown>;
    string: FilterFn<unknown>;
    id: FilterFn<unknown>;
    select: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const ToNumber = (val: string | number) => {
  // Convert to string first to handle both string and number inputs
  const strVal = String(val);

  if (strVal === "") return undefined;
  if (strVal === "-") return "-";
  if (strVal === ".") return ".";
  if (strVal === "-.") return "-.";

  // Allow for numbers being typed
  if (strVal.endsWith(".")) return strVal;
  if (strVal.match(/^-?\d*\.?\d*$/)) {
    const num = Number(strVal);
    return isNaN(num) ? undefined : num;
  }

  return undefined;
};

export const stringFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue?.value) return true;

  const value = String(row.getValue(columnId) || "").toLowerCase();
  const searchValue = String(filterValue.value).toLowerCase();

  switch (filterValue.rule) {
    case "contains":
      return value.includes(searchValue);
    case "equals":
      return value === searchValue;
    case "startsWith":
      return value.startsWith(searchValue);
    case "endsWith":
      return value.endsWith(searchValue);
    default:
      return value.includes(searchValue);
  }
};

export const numberFilter: FilterFn<any> = (row, columnId, filterValue) => {
  try {
    if (!filterValue?.value && filterValue?.value !== 0) return true;

    const rowValue = Number(row.getValue(columnId));
    if (isNaN(rowValue)) return false;

    // Handle different comparison rules
    switch (filterValue.rule) {
      case "equals": {
        const compareValue = ToNumber(filterValue.value);
        return typeof compareValue === "number" && rowValue === compareValue;
      }
      case "greaterThan": {
        const compareValue = ToNumber(filterValue.value);
        return typeof compareValue === "number" && rowValue > compareValue;
      }
      case "lessThan": {
        const compareValue = ToNumber(filterValue.value);
        return typeof compareValue === "number" && rowValue < compareValue;
      }
      case "between": {
        const min = ToNumber(filterValue.value);
        const max = ToNumber(filterValue.secondValue);

        if (typeof min !== "number" && typeof max !== "number") return true;
        if (typeof min === "number" && typeof max === "number") {
          return rowValue >= min && rowValue <= max;
        }
        if (typeof min === "number") return rowValue >= min;
        if (typeof max === "number") return rowValue <= max;

        return true;
      }
      default:
        return true;
    }
  } catch (error) {
    console.error("Error in number filter:", error);
    return false;
  }
};

export const idFilter: FilterFn<any> = (row, columnId, filterValue) => {
  console.log("filterValue", filterValue, row, columnId);

  if (!filterValue?.value) return true;

  const value = String(row.getValue(columnId) || "");
  const searchValue = String(filterValue.value);

  switch (filterValue.rule) {
    case "equals":
      return value === searchValue;
    case "contains":
      return value.includes(searchValue);
    default:
      return value === searchValue;
  }
};

export const dateFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue?.value) return true;

  const value = String(row.getValue(columnId) || "");
  const searchValue = String(filterValue.value);

  switch (filterValue.rule) {
    case "equals":
      return value === searchValue;
    case "contains":
      return value.includes(searchValue);
    default:
      return value === searchValue;
  }
};

// Improved fuzzy filter with better ranking
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value, {
    threshold: rankings.CONTAINS,
  });
  addMeta?.({ itemRank });
  return itemRank.passed;
};

export const selectFilter: FilterFn<any> = (row, columnId, filterValue) => {
  console.log("filterValue", filterValue, row, columnId);

  if (
    !filterValue?.value ||
    (Array.isArray(filterValue.value) && filterValue.value.length === 0)
  ) {
    return true;
  }

  const cellValue = row.getValue(columnId);

  if (cellValue === null || cellValue === undefined) {
    return false;
  }

  if (Array.isArray(filterValue.value)) {
    const normalizedCellValue = String(cellValue).toLowerCase().trim();
    return filterValue.value.some(
      (val: any) => String(val).toLowerCase().trim() === normalizedCellValue
    );
  }

  // Handle single value
  const normalizedCellValue = String(cellValue).toLowerCase().trim();
  const normalizedFilterValue = String(filterValue.value).toLowerCase().trim();
  return normalizedCellValue === normalizedFilterValue;
};
