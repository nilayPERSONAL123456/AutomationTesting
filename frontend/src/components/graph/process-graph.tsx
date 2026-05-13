"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";

import { ProcessGraphNode } from "./process-node";
import type { ProcessGraph as PG, ProcessNode as PN } from "@/lib/types";

const nodeTypes = { process: ProcessGraphNode };

export function ProcessGraphCanvas({ graph }: { graph: PG }) {
  const { nodes, edges } = useMemo(() => {
    // Lay out horizontally in dependency levels.
    const levels = new Map<string, number>();
    const compute = (id: string): number => {
      if (levels.has(id)) return levels.get(id)!;
      const node = graph.nodes.find((n) => n.id === id)!;
      const level = node.dependsOn.length
        ? Math.max(...node.dependsOn.map(compute)) + 1
        : 0;
      levels.set(id, level);
      return level;
    };
    graph.nodes.forEach((n) => compute(n.id));

    const perLevel = new Map<number, number>();
    const rfNodes: Node<PN>[] = graph.nodes.map((n) => {
      const level = levels.get(n.id)!;
      const index = perLevel.get(level) ?? 0;
      perLevel.set(level, index + 1);
      return {
        id: n.id,
        type: "process",
        position: { x: level * 300, y: index * 130 },
        data: n,
      };
    });

    const rfEdges: Edge[] = graph.edges.map((e) => {
      const targetStatus = graph.nodes.find((n) => n.id === e.target)?.status;
      const sourceStatus = graph.nodes.find((n) => n.id === e.source)?.status;
      const active =
        sourceStatus === "PASSED" &&
        (targetStatus === "RUNNING" || targetStatus === "RETRYING");
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: "smoothstep",
        animated: active,
        className: active ? "active" : undefined,
        style: {
          stroke:
            e.kind === "approval"
              ? "hsl(var(--warning) / 0.6)"
              : e.kind === "validation"
              ? "hsl(var(--info) / 0.6)"
              : "hsl(var(--border-strong))",
          strokeDasharray: e.kind === "validation" ? "4 4" : undefined,
        },
      };
    });

    return { nodes: rfNodes, edges: rfEdges };
  }, [graph]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      proOptions={{ hideAttribution: true }}
      minZoom={0.3}
      maxZoom={1.5}
      defaultEdgeOptions={{ type: "smoothstep" }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        color="hsl(var(--border))"
        gap={22}
        size={1}
      />
      <Controls
        showInteractive={false}
        position="bottom-right"
      />
      <MiniMap
        pannable
        zoomable
        style={{
          background: "hsl(var(--surface-2))",
          border: "1px solid hsl(var(--border))",
          borderRadius: 8,
        }}
        nodeColor={(n) => {
          const status = (n.data as PN).status;
          return status === "PASSED"
            ? "hsl(var(--success))"
            : status === "FAILED"
            ? "hsl(var(--danger))"
            : status === "RUNNING"
            ? "hsl(var(--accent))"
            : "hsl(var(--border-strong))";
        }}
        maskColor="hsl(var(--bg) / 0.7)"
      />
    </ReactFlow>
  );
}
