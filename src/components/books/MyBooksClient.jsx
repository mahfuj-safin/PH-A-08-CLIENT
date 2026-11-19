"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Pencil,
  Trash2,
  BookPlus,
  X,
  AlertTriangle,
  UploadCloud,
  Eye,
} from "lucide-react";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { useSession } from "@/lib/auth-client";
import { publicFetch, authFetch } from "@/lib/api";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { FadeUp } from "@/components/ui/MotionPrimitives";
import Image from "next/image";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

function MyBooksContent() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal state
  const [editingBook, setEditingBook] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    category: "Fiction",
    totalCopies: 1,
    description: "",
    image: "",
  });
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Custom Delete Confirm Modal state (NO window.confirm!)
  const [deletingBook, setDeletingBook] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const fetchMyBooks = useCallback(async () => {
    if (!userEmail) return;
    setLoading(true);
    try {
      const data = await publicFetch(
        `/books?email=${encodeURIComponent(userEmail)}`
      );
      setBooks(data);
    } catch (err) {
      toast.error(err.message || "Failed to load your books");
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchMyBooks();
  }, [fetchMyBooks]);

  // Open Edit Modal pre-filled with existing book data
  const openEditModal = (book) => {
    setEditingBook(book);
    setEditForm({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "Fiction",
      totalCopies: book.totalCopies ?? 1,
      description: book.description || "",
      image: book.image || "",
    });
    setNewImageFile(null);
    setNewImagePreview("");
  };

  const closeEditModal = () => {
    setEditingBook(null);
    setNewImageFile(null);
    setNewImagePreview("");
  };

  const handleEditImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingBook) return;

    setSavingEdit(true);
    const toastId = toast.loading("Saving changes...");

    try {
      let finalImageUrl = editForm.image;

      if (newImageFile) {
        finalImageUrl = await uploadImageToImgBB(newImageFile);
      }

      const payload = {
        title: editForm.title.trim(),
        author: editForm.author.trim(),
        category: editForm.category,
        totalCopies: parseInt(editForm.totalCopies, 10),
        description: editForm.description.trim(),
        image: finalImageUrl,
      };

      await authFetch(`/books/${editingBook._id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      // Update UI immediately
      setBooks((prev) =>
        prev.map((b) => (b._id === editingBook._id ? { ...b, ...payload } : b))
      );

      toast.success("Book updated successfully!", { id: toastId });
      closeEditModal();
    } catch (error) {
      toast.error(error.message || "Failed to update book", { id: toastId });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    setDeletingLoading(true);
    try {
      await authFetch(`/books/${deletingBook._id}`, {
        method: "DELETE",
      });

      setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
      toast.success(`"${deletingBook.title}" removed from library.`);
      setDeletingBook(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete book");
    } finally {
      setDeletingLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Contributor Shelf
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif mt-1">
            My Books
          </h1>
          <p className="text-sm sm:text-base text-base-content/70 mt-2">
            Manage, update, or remove the books you have shared with BookNook.
          </p>
        </div>

        <Link href="/add-book" className="btn btn-primary rounded-xl gap-2 self-start sm:self-auto">
          <BookPlus className="w-4 h-4" />
          Add New Book
        </Link>
      </FadeUp>

      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm text-base-content/60">Loading your books...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="bg-base-200/70 border border-dashed border-base-300 rounded-2xl p-14 text-center space-y-4">
          <h3 className="text-xl font-bold font-serif">You haven&apos;t added any books yet</h3>
          <p className="text-sm text-base-content/70 max-w-md mx-auto">
            Contribute your first book to the community library and watch readers discover it.
          </p>
          <Link href="/add-book" className="btn btn-primary rounded-xl gap-2">
            <BookPlus className="w-4 h-4" />
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200/80 text-base-content/80">
                <tr>
                  <th>Book</th>
                  <th>Category</th>
                  <th>Available Copies</th>
                  <th>Added On</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-base-200/40 transition-colors">
                    <td>
                      <div className="flex items-center gap-3.5">
                        <Image
                          src={book.image}
                          alt={book.title}
                          className="w-12 h-16 rounded-lg object-cover border border-base-300 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-sm sm:text-base line-clamp-1">
                            {book.title}
                          </p>
                          <p className="text-xs text-base-content/65 line-clamp-1">
                            by {book.author}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary badge-soft badge-sm font-medium">
                        {book.category}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm font-semibold ${(book.totalCopies ?? 0) > 0
                          ? "badge-success badge-soft"
                          : "badge-error badge-soft"
                          }`}
                      >
                        {book.totalCopies ?? 0} copies
                      </span>
                    </td>
                    <td className="text-xs text-base-content/70 whitespace-nowrap">
                      {book.createdAt
                        ? new Date(book.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                        : "Recently"}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/books/${book._id}`}
                          className="btn btn-ghost btn-xs rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(book)}
                          className="btn btn-outline btn-primary btn-xs rounded-lg gap-1"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingBook(book)}
                          className="btn btn-outline btn-error btn-xs rounded-lg gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT BOOK MODAL */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold font-serif">Edit Book Details</h2>
              <button
                type="button"
                onClick={closeEditModal}
                className="btn btn-ghost btn-circle btn-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text text-xs font-semibold">Book Title</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="input input-bordered input-sm w-full rounded-xl"
                  />
                </div>
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text text-xs font-semibold">Author Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.author}
                    onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                    className="input input-bordered input-sm w-full rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text text-xs font-semibold">Category</span>
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="select select-bordered select-sm w-full rounded-xl"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text text-xs font-semibold">Total Copies</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editForm.totalCopies}
                    onChange={(e) =>
                      setEditForm({ ...editForm, totalCopies: e.target.value })
                    }
                    className="input input-bordered input-sm w-full rounded-xl"
                  />
                </div>
              </div>

              {/* Cover Image Preview & Optional Replace */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-base-200/70 border border-base-300">
                <Image
                  src={newImagePreview || editForm.image}
                  alt="Book cover"
                  className="w-16 h-20 object-cover rounded-lg border border-base-300"
                />
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1.5">Cover Image</p>
                  <label className="btn btn-outline btn-xs rounded-lg gap-1.5 cursor-pointer">
                    <UploadCloud className="w-3.5 h-3.5" />
                    Replace Cover
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-xs font-semibold">Short Description</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="textarea textarea-bordered w-full rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="btn btn-ghost btn-sm rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="btn btn-primary btn-sm rounded-xl px-6"
                >
                  {savingEdit ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL (No browser confirm!) */}
      {deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="bg-base-100 border border-base-300 rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-error/10 text-error flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Delete Book?</h3>
                <p className="text-sm text-base-content/70 mt-1">
                  Are you sure you want to permanently remove{" "}
                  <span className="font-semibold text-base-content">
                    &ldquo;{deletingBook.title}&rdquo;
                  </span>{" "}
                  from BookNook? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={deletingLoading}
                onClick={() => setDeletingBook(null)}
                className="btn btn-ghost btn-sm rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingLoading}
                onClick={handleConfirmDelete}
                className="btn btn-error btn-sm rounded-xl px-5"
              >
                {deletingLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function MyBooksClient() {
  return (
    <PrivateRoute>
      <MyBooksContent />
    </PrivateRoute>
  );
}