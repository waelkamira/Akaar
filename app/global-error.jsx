// app/global-error.js
'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold">حدث خطأ!</h2>
          <button
            onClick={() => reset()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            حاول مرة أخرى
          </button>
        </div>
      </body>
    </html>
  );
}
