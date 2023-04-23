import { Button } from "components/form";
import { Modal } from "components/modal";
import { useState } from "react";
import { Plus } from "react-feather";
import { CreateGoodForm } from "./create-form";
import { GoodDeliverer } from "./deliverer";
import { GoodList } from "./list";

export function GoodScheduler() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  return (
    <>
      <GoodList openForm={openForm} />
      <div className="grid grid-cols-2 gap-3 px-4">
        <Button variant="ghost" icon={Plus} onClick={openForm}>
          添加物品
        </Button>
        <GoodDeliverer />
      </div>
      <Modal isOpen={isFormOpen} onClose={closeForm}>
        <CreateGoodForm onClose={closeForm} />
      </Modal>
    </>
  );
}
