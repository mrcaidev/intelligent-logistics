import { Modal } from "components/modal";
import { useState } from "react";
import { Plus } from "react-feather";
import { CreateGoodForm } from "./create-form";

export function GoodCreator() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="flex justify-center items-center gap-2 px-4 py-3 rounded bg-gray-300 hover:bg-gray-400 font-bold transition-colors"
      >
        <Plus size={20} />
        添加物品
      </button>
      <Modal isOpen={isOpen} onClose={close}>
        <CreateGoodForm onClose={close} />
      </Modal>
    </>
  );
}
