

export const Info = ({ label, value }: { label: string; value: JSX.Element | string | number | boolean | null | undefined }) => {
  return <div className="flex flex-col gap-2">
    <h3 className="text-md font-medium text-muted-foreground">{label}</h3>
    {typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? <p className="text-sm">{value}</p> : value}
  </div>;
};
