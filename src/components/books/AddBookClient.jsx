"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BookPlus, UploadCloud, X, Layers, UserCheck } from "lucide-react";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { useSession } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { authFetch } from "@/lib/api";
import { FadeUp } from "@/components/ui/MotionPrimitives";
import Image from "next/image";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

function AddBookForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    totalCopies: 3,
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please upload a book cover image.");
      return;
    }

    const copies = parseInt(formData.totalCopies, 10);
    if (isNaN(copies) || copies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Uploading cover image & saving book...");

    try {
      // 1. Upload image to ImgBB
      const uploadedImageUrl = await uploadImageToImgBB(imageFile);

      // 2. Save book to Express + MongoDB (JWT attached automatically)
      await authFetch("/books", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title.trim(),
          author: formData.author.trim(),
          category: formData.category,
          image: uploadedImageUrl,
          description: formData.description.trim(),
          totalCopies: copies,
          userName: user?.name,
          userEmail: user?.email,
        }),
      });

      toast.success("Book added to the BookNook library!", { id: toastId });
      router.push("/my-books");
    } catch (error) {
      toast.error(error.message || "Failed to add book.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FadeUp>
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Contribute to Community
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif mt-1">
            Add a New Book
          </h1>
          <p className="text-sm sm:text-base text-base-content/70 mt-2">
            Share a title with fellow BookNook readers. Fill in the details and upload a clear cover photo.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-base-100 border border-base-300 rounded-3xl shadow-sm p-6 sm:p-8 space-y-6"
        >
          {/* Row 1: Title & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-semibold">Book Title *</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Atomic Habits"
                className="input input-bordered w-full rounded-xl focus:input-primary"
              />
            </div>

            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-semibold">Author Name *</span>
              </label>
              <input
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                placeholder="e.g., James Clear"
                className="input input-bordered w-full rounded-xl focus:input-primary"
              />
            </div>
          </div>

          {/* Row 2: Category & Total Copies (Challenge field) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-semibold">Category *</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="select select-bordered w-full rounded-xl focus:select-primary"
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
                <span className="label-text font-semibold flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-primary" />
                  Total Copies *
                </span>
              </label>
              <input
                type="number"
                name="totalCopies"
                min={1}
                max={100}
                required
                value={formData.totalCopies}
                onChange={handleChange}
                className="input input-bordered w-full rounded-xl focus:input-primary"
              />
            </div>
          </div>

          {/* Row 3: Book Cover Upload (ImgBB) */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text font-semibold">Book Cover Image *</span>
            </label>

            {imagePreview ? (
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-base-200/70 border border-base-300">
                <Image
                  src={imagePreview}
                  alt="Cover preview"
                  width={112}
                  height={144}
                  unoptimized
                  className="w-28 h-36 object-cover rounded-xl shadow-md border border-base-300"
                />
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <p className="font-medium text-sm truncate max-w-xs">
                    {imageFile?.name}
                  </p>
                  <p className="text-xs text-base-content/60">
                    Ready to upload to ImgBB when you submit.
                  </p>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="btn btn-outline btn-error btn-xs rounded-lg gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-base-300 hover:border-primary rounded-2xl p-8 cursor-pointer bg-base-200/40 hover:bg-base-200/80 transition-colors">
                <UploadCloud className="w-9 h-9 text-primary mb-2" />
                <span className="font-semibold text-sm">
                  Click to choose a book cover image
                </span>
                <span className="text-xs text-base-content/60 mt-1">
                  PNG, JPG or WEBP (max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Row 4: Short Description */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text font-semibold">Short Description *</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a brief overview of what readers can expect from this book..."
              className="textarea textarea-bordered w-full rounded-xl focus:textarea-primary leading-relaxed"
            />
          </div>

          {/* Row 5: Read-only Contributor Info (Assignment Requirement) */}
          <div className="bg-base-200/60 border border-base-300 rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-3 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-primary" />
              Added By (Read-Only)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-0 pb-1">
                  <span className="label-text text-xs">User Name</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={user?.name || ""}
                  className="input input-bordered input-sm rounded-xl bg-base-200 cursor-not-allowed text-base-content/75"
                />
              </div>
              <div className="form-control">
                <label className="label py-0 pb-1">
                  <span className="label-text text-xs">User Email</span>
                </label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || ""}
                  className="input input-bordered input-sm rounded-xl bg-base-200 cursor-not-allowed text-base-content/75"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary rounded-xl px-8 gap-2 w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Adding Book...
                </>
              ) : (
                <>
                  <BookPlus className="w-4 h-4" />
                  Add Book
                </>
              )}
            </button>
          </div>
        </form>
      </FadeUp>
    </section>
  );
}

export default function AddBookClient() {
  return (
    <PrivateRoute>
      <AddBookForm />
    </PrivateRoute>
  );
}