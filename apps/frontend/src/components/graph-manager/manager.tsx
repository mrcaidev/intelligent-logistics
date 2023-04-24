import { Button } from "components/form";
import { Modal } from "components/modal";
import { useState } from "react";
import { Plus } from "react-feather";
import { CreateGraphForm } from "./create-form";
import { GraphList } from "./list";

export function GraphManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  return (
    <>
      <GraphList openForm={openForm} />
      <div className="px-4">
        <Button icon={Plus} onClick={openForm} className="w-full">
          添加
        </Button>
      </div>
      <Modal isOpen={isFormOpen} onClose={closeForm} title="添加方案">
        <CreateGraphForm onClose={closeForm} />
      </Modal>
    </>
  );
}
