import { redirect } from "next/navigation";
import { getAuthenticatedAuthor } from "@/lib/server-auth";

export default async function WritePage() {
  const author = await getAuthenticatedAuthor();
  if (author) redirect("/publish");
  redirect("/login?next=%2Fpublish&account-check=1");
}
