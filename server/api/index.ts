import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { default: app } = await import("../src/app");
    return (app as any)(req, res);
  } catch (err) {
    console.error("FATAL BOOT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server failed to initialize",
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
}