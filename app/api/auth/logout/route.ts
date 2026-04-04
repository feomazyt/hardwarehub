import { logoutUser } from "@/lib/controllers/auth.controller";

export async function POST() {
  return logoutUser();
}
