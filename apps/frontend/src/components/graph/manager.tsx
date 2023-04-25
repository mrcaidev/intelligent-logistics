import { Button } from "components/form";
import { Modal } from "components/modal";
import { useBoolean } from "hooks/use-boolean";
import { Plus } from "react-feather";
import { CreateGraphForm } from "./create-form";
import { GraphList } from "./list";

export function GraphManager() {
  const { value: isOpen, on: open, off: close } = useBoolean();

  return (
    <>
      <GraphList openForm={open} />
      <div className="px-4">
        <Button icon={Plus} onClick={open} className="w-full">
          添加
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={close} title="添加方案">
        <CreateGraphForm onClose={close} />
      </Modal>
    </>
  );
}
