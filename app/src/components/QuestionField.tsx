import type { Question } from "../data/questions";

interface Props {
  question: Question;
  value: string | string[] | undefined;
  otherValue: string | undefined;
  onChange: (value: string | string[]) => void;
  onOtherChange: (value: string) => void;
}

const OTHER_VALUE = "Other";

export default function QuestionField({
  question,
  value,
  otherValue,
  onChange,
  onOtherChange,
}: Props) {
  if (question.type === "text") {
    return (
      <textarea
        className="w-full rounded-xl border border-gray-300 p-4 text-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none resize-none"
        rows={4}
        placeholder="Type the participant's response here (optional)..."
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  const selected = question.type === "multi" ? ((value as string[]) ?? []) : value;

  const toggleMulti = (option: string) => {
    const current = (selected as string[]) ?? [];
    if (current.includes(option)) {
      onChange(current.filter((o) => o !== option));
    } else {
      onChange([...current, option]);
    }
  };

  const isSelected = (option: string) =>
    question.type === "multi"
      ? ((selected as string[]) ?? []).includes(option)
      : selected === option;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {question.options?.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() =>
            question.type === "multi" ? toggleMulti(option) : onChange(option)
          }
          className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left text-lg transition-all active:scale-[0.98] ${
            isSelected(option)
              ? "border-rose-500 bg-rose-50 text-rose-700 font-semibold"
              : "border-gray-200 bg-white text-gray-700 hover:border-rose-200 hover:bg-rose-50/40"
          }`}
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-${
              question.type === "multi" ? "md" : "full"
            } border-2 ${
              isSelected(option)
                ? "border-rose-500 bg-rose-500"
                : "border-gray-300 bg-white"
            }`}
          >
            {isSelected(option) && (
              <span className="text-white text-sm">✓</span>
            )}
          </span>
          {option}
        </button>
      ))}

      {question.allowOther && (
        <div
          className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left text-lg transition-all sm:col-span-2 ${
            isSelected(OTHER_VALUE)
              ? "border-rose-500 bg-rose-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <button
            type="button"
            onClick={() =>
              question.type === "multi"
                ? toggleMulti(OTHER_VALUE)
                : onChange(OTHER_VALUE)
            }
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-${
              question.type === "multi" ? "md" : "full"
            } border-2 ${
              isSelected(OTHER_VALUE)
                ? "border-rose-500 bg-rose-500"
                : "border-gray-300 bg-white"
            }`}
          >
            {isSelected(OTHER_VALUE) && (
              <span className="text-white text-sm">✓</span>
            )}
          </button>
          <span className="shrink-0 font-medium text-gray-700">Other:</span>
          <input
            type="text"
            className="w-full border-0 border-b border-gray-300 bg-transparent p-1 text-lg focus:border-rose-500 focus:outline-none"
            placeholder="Please specify"
            value={otherValue ?? ""}
            onFocus={() =>
              !isSelected(OTHER_VALUE) &&
              (question.type === "multi"
                ? toggleMulti(OTHER_VALUE)
                : onChange(OTHER_VALUE))
            }
            onChange={(e) => onOtherChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
