import { redirect } from "next/navigation";

export default function AIConsoleIndexRedirect() {
  redirect("/runs/run-1/console");
}
