"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

const url = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3010";
const convex = new ConvexReactClient(url);

export function ConvexClientProvider({ children }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

