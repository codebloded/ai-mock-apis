import { Suspense, type ErrorInfo, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CustomLoader } from "./loader";

const logError = (error: Error, info: ErrorInfo) => {
  console.log("ERROR CAUGHT IN BOUNDARY", error, info);
};

export function Boundary({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<CustomLoader />}>
      <ErrorBoundary
        fallback={FallbackRender as unknown as ReactNode}
        onError={logError}
      >
        {children}
      </ErrorBoundary>
    </Suspense>
  );
}

function FallbackRender({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div className="text-red-500 flex flex-col items-center justify-center">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
}
