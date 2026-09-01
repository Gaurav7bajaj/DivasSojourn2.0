/**
 * Customer profiles (post Clerk sign-up lead details).
 */

import { prisma } from "./prisma";

export type CustomerProfile = {
  id: string;
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
};

export type CustomerProfileInput = {
  clerkUserId: string;
  email?: string;
  firstName: string;
  lastName: string;
  phone: string;
};

function toProfile(row: {
  id: string;
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}): CustomerProfile {
  return {
    id: row.id,
    clerkUserId: row.clerkUserId,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    phone: row.phone,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isValidPhone(phone: string): boolean {
  const digits = normalizePhone(phone);
  // Accept 10-digit Indian mobiles, or 11–15 with country code
  return digits.length >= 10 && digits.length <= 15;
}

export async function getCustomerByClerkId(
  clerkUserId: string,
): Promise<CustomerProfile | null> {
  const row = await prisma.customerProfile.findUnique({ where: { clerkUserId } });
  return row ? toProfile(row) : null;
}

export async function hasCompletedProfile(clerkUserId: string): Promise<boolean> {
  const row = await prisma.customerProfile.findUnique({
    where: { clerkUserId },
    select: { id: true },
  });
  return Boolean(row);
}

export async function upsertCustomerProfile(
  input: CustomerProfileInput,
): Promise<CustomerProfile> {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const phone = normalizePhone(input.phone);
  const email = (input.email || "").trim().toLowerCase();

  const row = await prisma.customerProfile.upsert({
    where: { clerkUserId: input.clerkUserId },
    create: {
      clerkUserId: input.clerkUserId,
      email,
      firstName,
      lastName,
      phone,
    },
    update: {
      email: email || undefined,
      firstName,
      lastName,
      phone,
    },
  });

  return toProfile(row);
}

export async function getCustomerProfiles(): Promise<CustomerProfile[]> {
  const rows = await prisma.customerProfile.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProfile);
}
