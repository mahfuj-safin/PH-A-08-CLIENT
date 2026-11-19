export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="text-sm font-medium text-base-content/65">
        Turning the page...
      </p>
    </div>
  );
}