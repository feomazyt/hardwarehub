import { registerUser } from "@/lib/controllers/auth.controller";

export async function POST(request: Request) {
  return registerUser(request);
}
