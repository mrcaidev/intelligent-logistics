import { Button } from "components/form";
import { Modal } from "components/modal";
import { useBoolean } from "hooks/use-boolean";
import { Plus } from "react-feather";
import { GraphCreatorForm } from "./creator-form";
import { GraphList } from "./list";

export function GraphManager() {
  const { value: isFormOpen, on: openForm, off: closeForm } = useBoolean();

  return (
    <>
      <GraphList openForm={openForm} />
      <div className="px-4">
        <Button icon={Plus} onClick={openForm} className="w-full">
          添加
        </Button>
      </div>
      <Modal isOpen={isFormOpen} onClose={closeForm} title="添加方案">
        <GraphCreatorForm onClose={closeForm} />
      </Modal>
    </>
  );
}
