"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { User, Mail, Image as ImageIcon, Lock, Eye, EyeOff, BookOpen, CheckCircle2, XCircle } from "lucide-react";
import { signUp, signIn } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // Live password criteria checks (Assignment requirements)
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasMinLength = formData.password.length >= 6;

  const validatePassword = (pwd) => {
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter.";
    if (pwd.length < 6) return "Password must be at least 6 characters long.";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordError(value ? validatePassword(value) : "");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError("");

    const pwdErr = validatePassword(formData.password);
    if (pwdErr) {
      setPasswordError(pwdErr);
      toast.error(pwdErr);
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        image:
          formData.image.trim() ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name.trim())}&background=0f4c3a&color=fff`,
      });

      if (error) {
        const msg = error.message || "Registration failed. Please try again.";
        setFormError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      toast.success("Account created! Please log in to continue.");
      router.push("/login");
    } catch (err) {
      setFormError("Something went wrong during registration.");
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <section className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-base-100 border border-base-300 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Join BookNook</h1>
          <p className="text-sm text-base-content/70 mt-1">
            Create your free reader account in seconds
          </p>
        </div>

        {formError && (
          <div className="alert alert-error text-sm mb-5 rounded-xl py-3">
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="input input-bordered w-full pl-10 rounded-xl focus:input-primary"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text font-medium">Email Address</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input input-bordered w-full pl-10 rounded-xl focus:input-primary"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text font-medium">Photo URL</span>
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
              <input
                type="url"
                name="image"
                required
                value={formData.image}
                onChange={handleChange}
                placeholder="https://i.ibb.co/your-photo.jpg"
                className="input input-bordered w-full pl-10 rounded-xl focus:input-primary"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`input input-bordered w-full pl-10 pr-10 rounded-xl ${passwordError ? "input-error" : "focus:input-primary"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {passwordError && (
              <p className="text-xs text-error mt-1.5 font-medium">{passwordError}</p>
            )}

            {/* Live password checklist */}
            <div className="mt-2.5 space-y-1 text-xs bg-base-200/70 p-3 rounded-xl">
              <p className={`flex items-center gap-1.5 ${hasUppercase ? "text-success" : "text-base-content/60"}`}>
                {hasUppercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                At least 1 uppercase letter (A-Z)
              </p>
              <p className={`flex items-center gap-1.5 ${hasLowercase ? "text-success" : "text-base-content/60"}`}>
                {hasLowercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                At least 1 lowercase letter (a-z)
              </p>
              <p className={`flex items-center gap-1.5 ${hasMinLength ? "text-success" : "text-base-content/60"}`}>
                {hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                Minimum 6 characters
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full rounded-xl mt-2"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="divider text-xs text-base-content/50 my-6">OR CONTINUE WITH</div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="btn btn-outline w-full rounded-xl gap-2.5 border-base-300 hover:bg-base-200 hover:text-base-content"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-base-content/70 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}