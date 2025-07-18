/* eslint-disable @typescript-eslint/no-unused-vars */
// Path: src/components/ui/datatable/data-table.tsx

import React, { useState, useMemo, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  X,
} from "lucide-react";
import { debounce } from "lodash";
import type {
  DynamicDataTableProps,
  FilterConfig,
  DynamicFilter,
} from "./types";
import {
  fuzzyFilter,
  numberFilter,
  stringFilter,
  idFilter,
  selectFilter,
  dateFilter,
} from "./filters";
import { cn } from "@/lib/utils";

function DynamicDataTable<TData>({
  columns,
  data,
  filterConfig = [],
  additionalActions,
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  enableGlobalFilter = true,
  className,
  onCreateClick,
}: DynamicDataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { id: string; value: any; rule?: string; secondValue?: string }[]
  >([]);
  const [activeFilters, setActiveFilters] = useState<DynamicFilter[]>([]);

  const debouncedSetGlobalFilter = useMemo(
    () =>
      debounce((value: string) => {
        setGlobalFilter(value);
      }, 30),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetGlobalFilter.cancel();
    };
  }, [debouncedSetGlobalFilter]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
      number: numberFilter,
      string: stringFilter,
      id: idFilter,
      select: selectFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
  });

  const addFilter = (filter: FilterConfig) => {
    const defaultRule =
      filter.rules?.[0] ||
      (filter.type === "input"
        ? "contains"
        : filter.type === "number"
        ? "equals"
        : "equals");

    const newFilter: DynamicFilter = {
      ...filter,
      rule: defaultRule,
      value: "",
      secondValue: filter.type === "number" ? "" : undefined,
    };

    setActiveFilters((prev) => [...prev, newFilter]);
    setColumnFilters((prev) => [
      ...prev,
      {
        id: filter.id,
        value: "",
        rule: defaultRule,
        secondValue: filter.type === "number" ? "" : undefined,
      },
    ]);
  };

  const removeFilter = (filterId: string) => {
    const updatedActiveFilters = activeFilters.filter(
      (filter) => filter.id !== filterId
    );
    setActiveFilters(updatedActiveFilters);

    setColumnFilters((prev) => prev.filter((filter) => filter.id !== filterId));
  };

  const updateFilter = (filterId: string, updates: Partial<DynamicFilter>) => {
    setActiveFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId ? { ...filter, ...updates } : filter
      )
    );

    setColumnFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? {
              ...filter,
              value: updates.value ?? filter.value,
              rule: updates.rule ?? filter.rule,
              secondValue:
                typeof updates.secondValue === "string" ||
                updates.secondValue === undefined
                  ? updates.secondValue
                  : filter.secondValue,
            }
          : filter
      )
    );
  };

  const renderFilterInput = (filter: DynamicFilter, index: number) => {
    const renderRuleSelect = () => (
      <Select
        value={filter.rule}
        onValueChange={(rule) => updateFilter(filter.id, { rule })}
      >
        <SelectTrigger className="w-[120px] mr-2">
          <SelectValue placeholder="Rule" />
        </SelectTrigger>
        <SelectContent>
          {filter.rules?.map((rule) => (
            <SelectItem key={rule} value={rule}>
              {rule}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );

    switch (filter.type) {
      case "select":
        return (
          <Select
            value={filter.value}
            onValueChange={(value) => updateFilter(filter.id, { value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "number":
        return (
          <div className="flex items-center space-x-2">
            {renderRuleSelect()}
            {filter.rule === "between" ? (
              <>
                <Input
                  type="number"
                  placeholder="Min"
                  value={filter.value}
                  onChange={(e) =>
                    updateFilter(filter.id, {
                      value: e.target.value,
                    })
                  }
                  className="w-[120px]"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filter.secondValue}
                  onChange={(e) =>
                    updateFilter(filter.id, {
                      secondValue: e.target.value,
                    })
                  }
                  className="w-[120px]"
                />
              </>
            ) : (
              <Input
                type="number"
                placeholder={filter.placeholder}
                value={filter.value}
                onChange={(e) =>
                  updateFilter(filter.id, {
                    value: e.target.value,
                  })
                }
                className="w-[180px]"
              />
            )}
          </div>
        );

      default:
        return (
          <div className="flex items-center space-x-2">
            {renderRuleSelect()}
            <Input
              placeholder={filter.placeholder}
              value={filter.value}
              onChange={(e) =>
                updateFilter(filter.id, {
                  value: e.target.value,
                })
              }
              className="w-[180px]"
            />
          </div>
        );
    }
  };

  const availableFilters = filterConfig.filter(
    (filter) =>
      !activeFilters.some((activeFilter) => activeFilter.id === filter.id)
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-2">
        {enableGlobalFilter && (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Global Search..."
              value={globalFilter ?? ""}
              onChange={(e) => debouncedSetGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
            {globalFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGlobalFilter("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          {onCreateClick && (
            <Button onClick={onCreateClick} variant="default">
              Create New
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Add Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {availableFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.id}
                  onSelect={() => addFilter(filter)}
                >
                  {filter.placeholder}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {additionalActions}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {activeFilters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center bg-secondary rounded-md px-2 py-1"
            >
              {renderFilterInput(filter, activeFilters.indexOf(filter))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter(filter.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-md border w-full">
        <div className="overflow-x-auto relative w-full">
          <div className="min-w-full inline-block">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer select-none"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} rows
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DynamicDataTable;
