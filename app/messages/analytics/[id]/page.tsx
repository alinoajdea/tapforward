import { useParams } from "next/navigation";

export default function AnalyticsPage() {
  const { id } = useParams();

  return (
    <div className="max-w-xl mx-auto py-10 text-center">
      <h1 className="text-3xl font-bold mb-6">Analytics (Pro Only)</h1>
      <p className="text-gray-500 mb-4">
        Analytics for message <span className="font-mono">{id}</span> coming
        soon!
      </p>
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl text-yellow-800">
        <span className="font-bold">Pro feature:</span> See detailed
        unlock/forward stats here.
      </div>
    </div>
  );
}
