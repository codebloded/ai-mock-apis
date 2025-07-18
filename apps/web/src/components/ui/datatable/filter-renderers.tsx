import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DynamicFilter } from "./types";
import { toast } from "sonner";
import { X } from "lucide-react";

// Function to render the rule selection for input and number filters
const RenderRuleSelect = ({
  filter,
  updateFilter,
}: {
  filter: DynamicFilter;
  updateFilter: (filterId: string, updates: Partial<DynamicFilter>) => void;
}) => (
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

export function RenderSelectFilter({
  filter,
  updateFilter,
}: {
  filter: DynamicFilter;
  updateFilter: (filterId: string, updates: Partial<DynamicFilter>) => void;
}) {
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
}

const ToNumber = (val: string) => {
  if (val === "") return undefined;
  if (val === "-") return "-";
  if (val === ".") return ".";
  if (val === "-.") return "-.";

  // Allow for numbers being typed
  if (val.endsWith(".")) return val;
  if (val.match(/^-?\d*\.?\d*$/)) {
    return Number(val);
  }

  return Number(val);
};

export function RenderNumberFilter({
  filter,
  updateFilter,
}: {
  filter: DynamicFilter;
  updateFilter: (filterId: string, updates: Partial<DynamicFilter>) => void;
}) {
  const handleNumberChange = (
    value: string,
    field: "value" | "secondValue",
  ) => {
    try {
      // Handle empty input
      if (value === "") {
        updateFilter(filter.id, { [field]: undefined });
        return;
      }

      const numValue = ToNumber(value);

      // Allow partial inputs while typing
      if (typeof numValue === "string") {
        updateFilter(filter.id, { [field]: numValue });
        return;
      }

      // Handle undefined or invalid numbers
      if (numValue === undefined) {
        toast.error("Please enter a valid number");
        return;
      }

      updateFilter(filter.id, { [field]: numValue });
    } catch (error) {
      console.error("Error handling number input:", error);
      toast.error("An error occurred while processing the number");
    }
  };

  const getDisplayValue = (value: any) => {
    if (value === undefined || value === "") return "";
    if (typeof value === "string" && ["-", ".", "-."].includes(value))
      return value;
    const numValue = ToNumber(value);
    if (numValue === undefined) return "";
    if (typeof numValue === "string") return numValue;
    return numValue.toFixed(2); // Show 2 decimal places consistently
  };

  return (
    <div className="flex items-center space-x-2">
      <RenderRuleSelect filter={filter} updateFilter={updateFilter} />
      {filter.rule === "between" ? (
        <>
          <div className="relative">
            <Input
              type="number"
              placeholder="Min"
              value={getDisplayValue(filter.value)}
              onChange={(e) => handleNumberChange(e.target.value, "value")}
              className="w-[120px]"
              step="0.01"
            />
            {filter.value && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() =>
                  updateFilter(filter.id, {
                    value: undefined,
                  })
                }
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="relative">
            <Input
              type="number"
              placeholder="Max"
              value={getDisplayValue(filter.secondValue)}
              onChange={(e) =>
                handleNumberChange(e.target.value, "secondValue")
              }
              className="w-[120px]"
              step="0.01"
            />
            {filter.secondValue && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() =>
                  updateFilter(filter.id, {
                    secondValue: undefined,
                  })
                }
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="relative">
          <Input
            type="number"
            placeholder={filter.placeholder}
            value={getDisplayValue(filter.value)}
            onChange={(e) => handleNumberChange(e.target.value, "value")}
            className="w-[180px]"
            step="0.01"
          />
          {filter.value && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => updateFilter(filter.id, { value: undefined })}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function RenderTextInputFilter({
  filter,
  updateFilter,
}: {
  filter: DynamicFilter;
  updateFilter: (filterId: string, updates: Partial<DynamicFilter>) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <RenderRuleSelect filter={filter} updateFilter={updateFilter} />
      <Input
        placeholder={filter.placeholder}
        value={filter.value}
        onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
        className="w-[180px]"
      />
    </div>
  );
}

export function RenderIDFilter({
  filter,
  updateFilter,
}: {
  filter: DynamicFilter;
  updateFilter: (filterId: string, updates: Partial<DynamicFilter>) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <RenderRuleSelect filter={filter} updateFilter={updateFilter} />
      <Input
        placeholder={filter.placeholder}
        value={filter.value}
        onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
        className="w-[180px]"
      />
    </div>
  );
}

export function RenderDateFilter({
  filter,
  updateFilter,
}: {
  filter: DynamicFilter;
  updateFilter: (filterId: string, updates: Partial<DynamicFilter>) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      {/* Date seletor  */}
      <div className="relative">
        <Input
          type="date"
          placeholder={filter.placeholder}
          value={filter.value}
          onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
          className="w-[180px]"
        />
        {filter.value && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => updateFilter(filter.id, { value: undefined })}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
