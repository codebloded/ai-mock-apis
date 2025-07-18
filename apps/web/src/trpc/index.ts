import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@api"; // shared types from server
import { httpBatchLink } from "@trpc/client";

export const trpc = createTRPCReact<AppRouter>();

export function getTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: "http://localhost:3000/trpc",
      }),
    ],
  });
}
