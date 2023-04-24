import { Button } from "components/form";
import { Modal } from "components/modal";
import { useState } from "react";
import { Plus } from "react-feather";
import { CreateGraphForm } from "./create-form";

export function GraphCreator() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <>
      <Button icon={Plus} onClick={open}>
        添加
      </Button>
      <Modal isOpen={isOpen} onClose={close} title="添加物流方案">
        <CreateGraphForm onClose={close} />
      </Modal>
    </>
  );
}
