import { redirect } from "next/navigation"

export default function DocumentationPage() {
  redirect("/settings?tab=documentation")
}
