import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const CUSTOMER_SESSION_COOKIE = "scf_customer_session";
export const ADMIN_SESSION_COOKIE = "scf_admin_session";

export async function getCurrentCustomer() {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;

  if (!customerId) return null;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer || !customer.isActive) return null;

  return customer;
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const adminId = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!adminId) return null;

  const admin = await prisma.adminUser.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (!admin) return null;

  return admin;
}