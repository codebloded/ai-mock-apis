import { ThreeDot } from "./threeDot";

export function ActionCell({ row, config }: { row: any, config: any }) {
  return <ThreeDot row={row.original} config={config} />;
}
