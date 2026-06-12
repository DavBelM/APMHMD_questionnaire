import { useNavigate } from "react-router-dom";

export default function ConsentPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 sm:p-10">
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-3xl mb-3">
            🤱
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Awareness &amp; Preparedness for Maternal Health Monitoring Devices
          </h1>
        </div>

        <div className="space-y-4 text-gray-700 text-base leading-relaxed">
          <p>
            <strong>Purpose:</strong> This survey asks about your awareness of
            wearable maternal health devices (such as fetal monitors or
            contraction trackers) and your readiness to use them.
          </p>
          <p>
            <strong>Who should answer:</strong> Pregnant women aged 18–45 who
            are attending antenatal care (ANC) at this clinic.
          </p>
          <p>
            <strong>Time needed:</strong> 10–15 minutes.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="font-semibold text-amber-900 mb-2">Your rights:</p>
            <ul className="list-disc list-inside space-y-1 text-amber-900">
              <li>
                Participation is voluntary. You may skip any question or stop
                at any time.
              </li>
              <li>
                Your antenatal care will NOT be affected whether you say yes
                or no.
              </li>
              <li>
                No names or addresses are collected. Your answers are
                anonymous.
              </li>
            </ul>
          </div>

          <p className="text-sm text-gray-500">
            <strong>Researcher:</strong> Benjamin Ishimwe, African Leadership
            University (b.ishimwe6@alustudent.com)
            <br />
            <strong>Supervisor:</strong> Nathalie Nikokeza
            (r.nikokeza@alueducation.com)
          </p>

          <p className="font-medium text-gray-800">
            By continuing, you confirm the participant is pregnant, aged
            18–45, and agrees to participate voluntarily.
          </p>

          <p className="text-center text-rose-600 font-medium">
            Your voice matters – simple taps make prenatal care safer for
            Rwanda families! ❤️
          </p>
        </div>

        <button
          onClick={() => navigate("/questionnaire")}
          className="mt-8 w-full rounded-xl bg-rose-600 py-4 text-lg font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-700 active:scale-[0.99]"
        >
          Start Questionnaire
        </button>
      </div>
    </div>
  );
}
