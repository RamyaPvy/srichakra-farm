import { redirect } from "next/navigation";

export default function SheepPage() {
  redirect("/category/sheep?tab=young-lambs");
}