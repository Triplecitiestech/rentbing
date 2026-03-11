import ImageManager from "./ImageManager";

export const dynamic = "force-dynamic";

export default function AdminImagesPage() {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-950 p-4">
        <div className="rounded-xl border border-red-500/30 bg-red-600/10 p-8 text-center">
          <h1 className="mb-2 text-xl font-bold text-red-400">
            ADMIN_API_KEY not configured
          </h1>
          <p className="text-sm text-secondary-400">
            Add ADMIN_API_KEY to your .env.local file to use the image manager.
          </p>
        </div>
      </div>
    );
  }

  return <ImageManager adminKey={adminKey} />;
}
