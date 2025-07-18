/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import DynamicDataTable from "../ui/datatable/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import type { FilterConfig } from "../ui/datatable/types";
import { Card } from "../ui/card";

export type TableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  filterConfig: FilterConfig[];
  Kpis: [
    {
      label: string;
      value: string | number | boolean;
    }
  ];
  onCreateClick?: () => void;
};

export const Table = ({
  columns,
  data,
  filterConfig,
  Kpis,
  onCreateClick,
}: TableProps<any>) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Kpis.map((kpi) => (
          <Card key={kpi.label} className="overflow-hidden">
            <div className="p-6 flex flex-col space-y-2">
              <div className="text-sm text-muted-foreground font-medium">
                {kpi.label}
              </div>
              <div className="text-2xl font-bold tracking-tight">
                {typeof kpi.value === "number"
                  ? new Intl.NumberFormat().format(kpi.value)
                  : kpi.value}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-2"></div>

      <DynamicDataTable
        columns={columns}
        data={data}
        filterConfig={filterConfig}
        onCreateClick={onCreateClick}
      />
    </div>
  );
};
