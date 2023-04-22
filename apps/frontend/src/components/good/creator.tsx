import { Plus } from "react-feather";

export function GoodCreator() {
  return (
    <button
      type="button"
      className="flex justify-center items-center gap-2 px-4 py-3 rounded bg-gray-300 hover:bg-gray-400 font-bold transition-colors"
    >
      <Plus size={20} />
      添加物品
    </button>
  );
}
