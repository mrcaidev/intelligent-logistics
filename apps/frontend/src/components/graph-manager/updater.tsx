import { Modal } from "components/modal";
import { useState } from "react";
import { Edit } from "react-feather";
import { Graph } from "shared-types";
import { UpdateGraphForm } from "./update-form";

type Props = {
  graph: Graph;
};

export function GraphUpdater(props: Props) {
  const { graph } = props;
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="p-1 text-gray-600 hover:text-teal-700"
      >
        <Edit size={18} />
      </button>
      <Modal isOpen={isOpen} onClose={close} title="修改方案">
        <UpdateGraphForm graph={graph} onClose={close} />
      </Modal>
    </>
  );
}
