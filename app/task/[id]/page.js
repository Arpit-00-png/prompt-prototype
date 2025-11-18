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
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

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

  const handleSubmitWork = async (e) => {
    if (e) e.preventDefault();
    if (!token) return;
    setMessage("");
    try {
      await callApi("/api/tasks/complete", { 
        taskId,
        submissionText,
        submissionFiles: submissionFiles.filter(f => f.trim())
      });
      await fetchTask();
      setMessage("Work submitted for approval!");
      setSubmissionText("");
      setSubmissionFiles([]);
      setShowSubmissionForm(false);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const addFileLink = () => {
    setSubmissionFiles([...submissionFiles, ""]);
  };

  const updateFileLink = (index, value) => {
    const updated = [...submissionFiles];
    updated[index] = value;
    setSubmissionFiles(updated);
  };

  const removeFileLink = (index) => {
    setSubmissionFiles(submissionFiles.filter((_, i) => i !== index));
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
        <p className={`glass-panel text-sm ${
          message.includes("error") || message.includes("Error") || message.includes("Unable")
            ? "text-red-300"
            : "text-emerald-200"
        }`}>
          {message}
        </p>
      )}

      {isAssignee && task.status === "assigned" && (
        <div className="glass-panel space-y-4">
          {!showSubmissionForm ? (
            <button 
              className="btn-primary w-full" 
              onClick={() => setShowSubmissionForm(true)}
            >
              Submit Work for Review
            </button>
          ) : (
            <form onSubmit={handleSubmitWork} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wide text-slate-300">
                  Work Submission
                </label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Describe your work, provide details, share results, or paste your submission here..."
                  className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm"
                  rows={6}
                  required
                />
                <p className="mt-2 text-xs text-slate-400">
                  Provide a detailed description of the work completed, deliverables, or any relevant information.
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wide text-slate-300">
                    File Links (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={addFileLink}
                    className="text-xs text-brand-200 hover:text-brand-100"
                  >
                    + Add Link
                  </button>
                </div>
                {submissionFiles.map((file, index) => (
                  <div key={index} className="mb-2 flex gap-2">
                    <input
                      type="url"
                      value={file}
                      onChange={(e) => updateFileLink(index, e.target.value)}
                      placeholder="https://example.com/file.pdf or Google Drive link"
                      className="flex-1 rounded-2xl border border-white/10 bg-black/30 p-3 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeFileLink(index)}
                      className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 text-sm text-red-300 hover:bg-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {submissionFiles.length === 0 && (
                  <p className="text-xs text-slate-400">
                    You can add links to files (Google Drive, Dropbox, GitHub, etc.) if your work includes files.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmissionForm(false);
                    setSubmissionText("");
                    setSubmissionFiles([]);
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Submit for Review
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {task.status === "submitted" && task.submission_text && (
        <section className="glass-panel space-y-4">
          <header>
            <p className="text-xs uppercase tracking-widest text-brand-200">
              Submitted Work
            </p>
            <h2 className="text-xl font-semibold">Work Submission</h2>
            {task.submitted_at && (
              <p className="text-xs text-slate-400">
                Submitted on {new Date(task.submitted_at).toLocaleString()}
              </p>
            )}
          </header>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="whitespace-pre-wrap text-sm text-slate-200">
              {task.submission_text}
            </p>
          </div>

          {task.submission_files && task.submission_files.length > 0 && (
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-300">
                Files & Links
              </p>
              <div className="space-y-2">
                {task.submission_files.map((file, index) => (
                  <a
                    key={index}
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-brand-200 hover:bg-black/50 hover:text-brand-100"
                  >
                    🔗 {file}
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
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

