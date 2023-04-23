import { Send } from "react-feather";

export function GoodDeliverer() {
  return (
    <button
      type="button"
      className="flex justify-center items-center gap-2 px-4 py-3 rounded bg-teal-600 hover:bg-teal-700 font-bold text-gray-100 transition-colors"
    >
      <Send size={20} />
      发货
    </button>
  );
}
