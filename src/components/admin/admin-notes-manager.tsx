"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Check, X, FileText, UploadCloud, BookOpen } from "lucide-react";

interface NoteRecord {
  _id: string;
  title: string;
  slug: string;
  description: string;
  subject: string;
  category: string;
  yearTag: string;
  price: number; // in paise
  mrp: number; // in paise
  coverUrl?: string;
  pdfKey?: string;
  samplePages: number;
  published: boolean;
  featured: boolean;
  color?: string;
  tags?: string[];
  whatsInside?: string[];
}

export function AdminNotesManager() {
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteRecord | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("General Medicine");
  const [yearTag, setYearTag] = useState("2nd Prof");
  const [priceRupees, setPriceRupees] = useState("299");
  const [mrpRupees, setMrpRupees] = useState("499");
  const [samplePages, setSamplePages] = useState("3");
  const [pdfKey, setPdfKey] = useState("");
  const [color, setColor] = useState("#141A2E");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [whatsInsideStr, setWhatsInsideStr] = useState("");

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch (e) {
      console.error("Failed to load notes", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/notes")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && data) setNotes(data.notes || []);
      })
      .catch((e) => console.error("Failed to load notes", e))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingNote(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setSubject("");
    setCategory("General Medicine");
    setYearTag("2nd Prof");
    setPriceRupees("299");
    setMrpRupees("499");
    setSamplePages("3");
    setPdfKey("");
    setColor("#141A2E");
    setPublished(true);
    setFeatured(false);
    setWhatsInsideStr("");
    setModalOpen(true);
  };

  const openEditModal = (n: NoteRecord) => {
    setEditingNote(n);
    setTitle(n.title);
    setSlug(n.slug);
    setDescription(n.description);
    setSubject(n.subject);
    setCategory(n.category);
    setYearTag(n.yearTag);
    setPriceRupees((n.price / 100).toString());
    setMrpRupees((n.mrp / 100).toString());
    setSamplePages(n.samplePages.toString());
    setPdfKey(n.pdfKey || "");
    setColor(n.color || "#141A2E");
    setPublished(n.published);
    setFeatured(n.featured);
    setWhatsInsideStr(n.whatsInside?.join("\n") || "");
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingNote) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description || !subject) {
      alert("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    const payload = {
      title,
      slug,
      description,
      subject,
      category,
      yearTag,
      price: parseFloat(priceRupees) || 0,
      mrp: parseFloat(mrpRupees) || 0,
      samplePages: parseInt(samplePages) || 3,
      pdfKey,
      color,
      published,
      featured,
      whatsInside: whatsInsideStr
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = editingNote ? `/api/admin/notes/${editingNote._id}` : "/api/admin/notes";
      const method = editingNote ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchNotes();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save note");
      }
    } catch (e) {
      alert("Network error saving note");
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (n: NoteRecord) => {
    try {
      const res = await fetch(`/api/admin/notes/${n._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !n.published }),
      });
      if (res.ok) {
        setNotes((prev) =>
          prev.map((item) => (item._id === n._id ? { ...item, published: !item.published } : item))
        );
      }
    } catch (e) {
      alert("Failed to toggle publish status");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/notes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotes((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (e) {
      alert("Failed to delete note");
    }
  };

  return (
    <div className="mt-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-[var(--navy)]/15">
        <div>
          <h2 className="font-serif font-black text-xl sm:text-2xl text-[var(--navy)] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--coral)]" />
            <span>Storefront Notes Library</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--navy)] text-[var(--cream)]">
              {notes.length} Active
            </span>
          </h2>
          <p className="text-xs text-[var(--navy)]/65 font-sans mt-0.5">
            Manage your medical handwritten notes, pricing, sample pages, and Cloudflare R2 PDF links.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl border-2 border-[var(--navy)] bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-[var(--navy)] text-xs font-bold transition shadow-[3px_3px_0_var(--navy)] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Note</span>
        </button>
      </div>

      {/* Notes List Table / Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-[var(--navy)]/60">
          Loading catalog from MongoDB Atlas...
        </div>
      ) : notes.length === 0 ? (
        <div className="p-8 rounded-2xl border-2 border-dashed border-[var(--navy)]/25 text-center bg-white">
          <FileText className="w-8 h-8 text-[var(--coral)] mx-auto mb-2" />
          <h3 className="font-serif font-bold text-base text-[var(--navy)]">No Notes in Database</h3>
          <p className="text-xs text-[var(--navy)]/60 max-w-sm mx-auto mt-1 mb-4">
            Upload your first high-yield medical notebook to make it visible on the 3D stage and catalog.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-lg bg-[var(--navy)] text-[var(--cream)] text-xs font-bold"
          >
            Create Note
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((n) => (
            <div
              key={n._id}
              className="p-4 rounded-xl border-2 border-[var(--navy)] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[4px_4px_0_var(--navy)]"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className="w-12 h-14 rounded-lg border-2 border-[var(--navy)] flex items-center justify-center shrink-0 text-white font-serif font-black text-xs shadow-sm"
                  style={{ backgroundColor: n.color || "#141A2E" }}
                >
                  NOTE
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif font-bold text-base text-[var(--navy)]">
                      {n.title}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--cream)] border border-[var(--navy)]/20 text-[var(--navy)]">
                      {n.subject}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 text-[var(--navy)]/70">
                      {n.yearTag}
                    </span>
                    {n.featured && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--coral)] text-[var(--navy)]">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[var(--navy)]/65 mt-1">
                    <span className="font-bold text-[var(--coral-ink)]">
                      ₹{Math.round(n.price / 100)}
                    </span>
                    <span className="line-through text-[var(--navy)]/40">
                      ₹{Math.round(n.mrp / 100)}
                    </span>
                    <span>• {n.samplePages} sample pages</span>
                    <span>• slug: /{n.slug}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <button
                  onClick={() => togglePublished(n)}
                  title={n.published ? "Click to set Draft" : "Click to Publish"}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1 transition cursor-pointer ${
                    n.published
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : "bg-amber-50 border-amber-300 text-amber-800"
                  }`}
                >
                  {n.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{n.published ? "Published" : "Draft"}</span>
                </button>

                <button
                  onClick={() => openEditModal(n)}
                  className="p-2 rounded-lg border-2 border-[var(--navy)] bg-[var(--cream)] hover:bg-[var(--coral)] text-[var(--navy)] transition cursor-pointer"
                  title="Edit Note"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(n._id, n.title)}
                  className="p-2 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 transition cursor-pointer"
                  title="Delete Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-3 border-[var(--navy)] rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-[8px_8px_0_var(--navy)] relative my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-[var(--navy)]/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif font-black text-xl text-[var(--navy)] mb-1">
              {editingNote ? "Edit Note Details" : "Upload & Create New Note"}
            </h2>
            <p className="text-xs text-[var(--navy)]/60 mb-5 font-sans">
              Enter metadata, pricing in Rupees, and Cloudflare R2 storage key.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-[var(--navy)] block mb-1">
                    Note Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    placeholder="e.g. Ophthalmology Final Prof"
                    className="w-full px-3 py-2 text-xs border-2 border-[var(--navy)] rounded-lg font-sans focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-[var(--navy)] block mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="ophthalmology-prof-exam"
                    className="w-full px-3 py-2 text-xs border-2 border-[var(--navy)] rounded-lg font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[var(--navy)] block mb-1">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={2}
                  placeholder="Concise overview of what high-yield diagrams and chapters are covered..."
                  className="w-full px-3 py-2 text-xs border-2 border-[var(--navy)] rounded-lg font-sans focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-[var(--navy)] block mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    placeholder="Surgery"
                    className="w-full px-3 py-2 text-xs border-2 border-[var(--navy)] rounded-lg font-sans focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-[var(--navy)] block mb-1">
                    Prof / Year Tag
                  </label>
                  <input
                    type="text"
                    value={yearTag}
                    onChange={(e) => setYearTag(e.target.value)}
                    placeholder="2nd Prof"
                    className="w-full px-3 py-2 text-xs border-2 border-[var(--navy)] rounded-lg font-sans focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-[var(--navy)] block mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={priceRupees}
                    onChange={(e) => setPriceRupees(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border-2 border-[var(--navy)] rounded-lg font-mono font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-[var(--navy)] block mb-1">
                    MRP / Cut Price (₹)
                  </label>
                  <input
                    type="number"
                    value={mrpRupees}
                    onChange={(e) => setMrpRupees(e.target.value)}
                    className="w-full px-3 py-2 text-xs border-2 border-[var(--navy)] rounded-lg font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-[var(--navy)] block mb-1">
                    Private R2 PDF Key
                  </label>
                  <input
                    type="text"
                    value={pdfKey}
                    onChange={(e) => setPdfKey(e.target.value)}
                    placeholder="notes/ophthalmology-full.pdf"
                    className="w-full px-3 py-2 text-xs border-2 border-[var(--navy)] rounded-lg font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-[var(--navy)] block mb-1">
                    Cover Color Tone
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-8 h-8 rounded border border-[var(--navy)] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border-2 border-[var(--navy)] rounded-lg font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[var(--navy)] block mb-1">
                  What&apos;s Inside (One item per line)
                </label>
                <textarea
                  value={whatsInsideStr}
                  onChange={(e) => setWhatsInsideStr(e.target.value)}
                  rows={3}
                  placeholder="Anterior Chamber Examination Flowcharts&#10;Glaucoma Management Quick Reference&#10;High-Yield Drug Dosages"
                  className="w-full px-3 py-2 text-xs border-2 border-[var(--navy)] rounded-lg font-sans focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-mono font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--coral)] focus:ring-0"
                  />
                  <span>Published (Visible on storefront)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-mono font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--coral)] focus:ring-0"
                  />
                  <span>Featured (Highlight on home stage)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--navy)]/15">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border-2 border-[var(--navy)] bg-[var(--cream)] text-xs font-bold text-[var(--navy)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg border-2 border-[var(--navy)] bg-[var(--coral)] text-xs font-bold text-[var(--navy)] shadow-[3px_3px_0_var(--navy)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                >
                  {saving ? "Saving..." : editingNote ? "Update Note" : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

