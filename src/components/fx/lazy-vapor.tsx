"use client";

import dynamic from "next/dynamic";

/** Loads the WebGL vapour simulation after hydration so it never blocks first paint. */
export const LazyVapor = dynamic(() => import("./vapor-fluid"), { ssr: false });
