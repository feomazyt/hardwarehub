import { getCurrentUser } from "@/lib/controllers/auth.controller";

export async function GET() {
  return getCurrentUser();
}
