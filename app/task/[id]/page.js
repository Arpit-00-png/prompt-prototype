"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function TaskDetailPage({ params }) {
  const router = useRouter();
  const taskId = params.id;
  const [task, setTask] = useState(null);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchTask = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();
    setTask(data);
    setLoading(false);
  }, [taskId]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/auth/login");
        return;
      }
      setToken(session.access_token);
      setUserId(session.user.id);
      await fetchTask();
    };
    load();
  }, [router, fetchTask]);

  const callApi = async (endpoint, body) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to update task");
    }
    return data;
  };

  const handleSubmitWork = async () => {
    if (!token) return;
    setMessage("");
    try {
      await callApi("/api/tasks/complete", { taskId });
      await fetchTask();
      setMessage("Task submitted for approval.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleApproval = async (approve) => {
    if (!token) return;
    setMessage("");
    try {
      await callApi("/api/tasks/approve", { taskId, approve });
      await fetchTask();
      setMessage(approve ? "Task approved!" : "Task rejected & escrow refunded.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) {
    return <p className="glass-panel text-sm text-slate-300">Loading task…</p>;
  }
  if (!task) {
    return (
      <p className="glass-panel text-sm text-red-300">Task not found.</p>
    );
  }

  const isAssignee = task.assigned_to === userId;
  const isCreator = task.created_by === userId;

  return (
    <div className="space-y-6">
      <header className="glass-panel space-y-2">
        <p className="text-xs uppercase tracking-widest text-brand-200">
          Task #{task.id}
        </p>
        <h1 className="text-3xl font-bold">{task.title}</h1>
        <p className="text-sm text-slate-300">{task.description}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-white/15 px-3 py-1">
            Reward: {task.reward} TBM
          </span>
          <span className="rounded-full border border-white/15 px-3 py-1 capitalize">
            Status: {task.status}
          </span>
        </div>
      </header>

      {message && (
        <p className="glass-panel text-sm text-emerald-200">{message}</p>
      )}

      {isAssignee && task.status === "assigned" && (
        <button className="btn-primary" onClick={handleSubmitWork}>
          Mark work complete
        </button>
      )}

      {isCreator && task.status === "submitted" && (
        <div className="flex gap-3">
          <button
            className="btn-primary flex-1"
            onClick={() => handleApproval(true)}
          >
            Approve & release escrow
          </button>
          <button
            className="btn-secondary flex-1"
            onClick={() => handleApproval(false)}
          >
            Reject & refund
          </button>
        </div>
      )}
    </div>
  );
}

