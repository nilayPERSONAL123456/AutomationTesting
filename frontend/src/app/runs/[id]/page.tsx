import { api } from "@/lib/api";
import { LiveExecutionView } from "@/components/runs/live-execution-view";

export default async function LiveExecutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = await api.runs.get(id);
  return <LiveExecutionView run={run} />;
}
