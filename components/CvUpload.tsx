"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

export default function CvUpload() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(formData: FormData) {
    setBusy(true);
    setMessage("");
    try {
      const file = formData.get("file") as File | null;
      const title = String(formData.get("title") || "My CV").trim().slice(0, 120);
      if (!file || file.size === 0) throw new Error("Choose a CV file.");
      if (file.size > MAX_SIZE) throw new Error("CV must be 5 MB or smaller.");
      if (!ALLOWED.includes(file.type)) throw new Error("Only PDF or DOCX files are allowed.");
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase is not configured.");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in first.");
      const clean = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
      const path = `${user.id}/${crypto.randomUUID()}-${clean}`;
      const { error: uploadError } = await supabase.storage.from("cvs").upload(path, file, { upsert: false, contentType: file.type });
      if (uploadError) throw uploadError;
      const { error: rowError } = await supabase.from("cvs").insert({ user_id: user.id, title, file_path: path, file_name: file.name, mime_type: file.type, size_bytes: file.size });
      if (rowError) {
        await supabase.storage.from("cvs").remove([path]);
        throw rowError;
      }
      setMessage("CV uploaded.");
      window.location.reload();
    } catch (error) {
      const localMessages = new Set([
        "Choose a CV file.",
        "CV must be 5 MB or smaller.",
        "Only PDF or DOCX files are allowed.",
        "Supabase is not configured.",
        "Please sign in first.",
      ]);
      setMessage(error instanceof Error && localMessages.has(error.message) ? error.message : "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form action={upload} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <input name="title" placeholder="CV title" className="input" required />
      <input name="file" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="input" required />
      <button disabled={busy} className="btn-primary">{busy ? "Uploading..." : "Upload CV"}</button>
      {message && <p className="text-sm text-slate-300">{message}</p>}
    </form>
  );
}
