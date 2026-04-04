import bcrypt from "bcryptjs";

import * as usersRepository from "@/lib/repositories/users.repository";
import type { AuthUserDTO } from "@/types/auth";

export class AuthError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

function toUserDTO(user: {
  id: string;
  email: string;
  name: string | null;
}): AuthUserDTO {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function register(input: {
  email: string;
  password: string;
  name?: string;
}) {
  const email = normalizeEmail(input.email);
  const password = input.password.trim();
  const name = input.name?.trim() || null;

  if (!email) throw new AuthError("Email jest wymagany.", 400);
  if (password.length < 8) {
    throw new AuthError("Hasło musi mieć co najmniej 8 znaków.", 400);
  }

  const existing = await usersRepository.findByEmail(email);
  if (existing) throw new AuthError("Użytkownik już istnieje.", 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await usersRepository.create({ email, passwordHash, name });

  return toUserDTO(user);
}

export async function login(input: { email: string; password: string }) {
  const email = normalizeEmail(input.email);
  const password = input.password;
  if (!email || !password) {
    throw new AuthError("Email i hasło są wymagane.", 400);
  }

  const user = await usersRepository.findByEmail(email);
  if (!user) throw new AuthError("Nieprawidłowe dane logowania.", 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AuthError("Nieprawidłowe dane logowania.", 401);

  return toUserDTO(user);
}
