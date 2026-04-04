import { loginUser } from "@/lib/controllers/auth.controller";

export async function POST(request: Request) {
  return loginUser(request);
}
