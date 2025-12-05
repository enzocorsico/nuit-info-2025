"use client";

import { ResultContent } from "@/app/result/components/ResultContent";
import { Suspense } from "react";

function LoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto text-center py-20">
      <div className="animate-spin mb-4">
        <svg className="w-8 h-8 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <p className="text-slate-600">Chargement de vos résultats...</p>
    </div>
  );
}

export default function ResultPage() {
  return (
    <main className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 py-12 md:py-20 px-4 md:px-6">
      <Suspense fallback={<LoadingFallback />}>
        <ResultContent />
      </Suspense>
    </main>
  );
}
