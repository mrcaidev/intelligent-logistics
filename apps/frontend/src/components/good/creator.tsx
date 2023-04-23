import { Button } from "components/form";
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
      <Button variant="ghost" icon={Plus} onClick={open}>
        添加物品
      </Button>
      <Modal isOpen={isOpen} onClose={close}>
        <CreateGoodForm onClose={close} />
      </Modal>
    </>
  );
}
