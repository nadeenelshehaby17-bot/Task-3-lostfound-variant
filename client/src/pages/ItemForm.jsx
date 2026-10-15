import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

// TODO: build the Report Item page — see README.md "Your task".
// This page is already routed at /items/new (report) and /items/:id (edit),
// and both routes are wrapped in <ProtectedRoute>.

const defaults = {
  title: "",
  description: "",
  category: "other",
  status: "lost",
  location: "",
};

export default function ItemForm() {
  const nav = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(defaults);
  const [error, setError] = useState("");

  // TODO (edit mode): when there is an `id`, load the item and fill the form.
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    api
      .get("/items/" + id)
      .then((res) => {
        if (cancelled) return;
        const it = res.data.item;
        setForm({
          title: it.title ?? "",
          status: it.status ?? "lost",
          category: it.category ?? "other",
          location: it.location ?? "",
          description: it.description ?? "",
        });
      })
      .catch((err) => setError(err?.response?.data?.message || "Load failed"));
    return () => {
      cancelled = true;
    };
  }, [id]);

  // TODO: update `form` when an input changes.
  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // TODO: POST a new item, or PATCH the existing one when editing,
  // then go back to /items. Show the server's error message on failure.
  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (id) {
        await api.patch("/items/" + id, { ...form });
      } else {
        await api.post("/items", { ...form });
      }
      nav("/items");
    } catch (err) {
      setError(err?.response?.data?.message || "Save failed");
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">
        {id ? "Edit" : "Report"} Item
      </h1>
      <form onSubmit={onSubmit} className="space-y-3">
        {/* TODO: title input, status select, category select, location input and description textarea */}
        <input
          className="input"
          name="title"
          placeholder="e.g. Black backpack"
          value={form.title}
          onChange={onChange}
        />
        <select
          className="input"
          name="status"
          value={form.status}
          onChange={onChange}
        >
          <option value="lost">lost</option>
          <option value="found">found</option>
          <option value="claimed">claimed</option>
        </select>
        <select
          className="input"
          name="category"
          value={form.category}
          onChange={onChange}
        >
          <option value="electronics">electronics</option>
          <option value="clothing">clothing</option>
          <option value="documents">documents</option>
          <option value="accessories">accessories</option>
          <option value="other">other</option>
        </select>
        <input
          className="input"
          name="location"
          placeholder="e.g. Library 2nd floor"
          value={form.location}
          onChange={onChange}
        />
        <textarea
          className="input"
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={onChange}
        />

        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
