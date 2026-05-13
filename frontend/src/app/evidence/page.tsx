import { redirect } from "next/navigation";

export default function EvidenceIndexRedirect() {
  redirect("/runs/run-1/evidence");
}
