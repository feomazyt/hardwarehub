import { prisma } from "@/lib/db";

export async function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function create(input: {
  email: string;
  passwordHash: string;
  name?: string | null;
}) {
  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash: input.passwordHash,
      name: input.name ?? null,
    },
  });
}
