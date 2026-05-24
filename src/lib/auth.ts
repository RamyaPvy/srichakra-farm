import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const CUSTOMER_SESSION_COOKIE = "scf_customer_session";

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