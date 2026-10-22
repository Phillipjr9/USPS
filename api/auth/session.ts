import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ensureSchema } from "../_db";
import { currentUser, fail, publicUser } from "../_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }
  try {
    await ensureSchema();
    const user = await currentUser(req);
    res.status(200).json({ user: user ? publicUser(user) : null });
  } catch (err) {
    fail(res, err);
  }
}
