import { useNavigate } from "react-router-dom";

export default function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-4xl mb-4">
          ✅
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thank you!
        </h1>
        <p className="rounded-xl bg-green-50 border border-green-200 text-green-800 font-medium px-4 py-3 mb-4">
          Response saved successfully
        </p>
        <p className="text-gray-600 mb-8">
          You may now start a new questionnaire for the next participant.
        </p>
        <button
          onClick={() => navigate("/questionnaire")}
          className="w-full rounded-xl bg-rose-600 py-4 text-lg font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-700 active:scale-[0.99]"
        >
          Start New Response
        </button>
        <button
          onClick={() => navigate("/")}
          className="mt-3 w-full rounded-xl border-2 border-gray-200 py-4 text-lg font-semibold text-gray-600 transition hover:bg-gray-50 active:scale-[0.99]"
        >
          Back to Welcome Page
        </button>
      </div>
    </div>
  );
}
