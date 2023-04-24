import { Button } from "components/form";
import { Modal } from "components/modal";
import { useBoolean } from "hooks/use-boolean";
import { Plus } from "react-feather";
import { CreateGoodForm } from "./create-form";
import { GoodDeliverer } from "./deliverer";
import { GoodList } from "./list";

export function GoodScheduler() {
  const { value: isFormOpen, on: openForm, off: closeForm } = useBoolean();

  return (
    <>
      <GoodList openForm={openForm} />
      <div className="grid grid-cols-2 gap-3 px-4">
        <Button colorScheme="gray" variant="dim" icon={Plus} onClick={openForm}>
          添加
        </Button>
        <GoodDeliverer />
      </div>
      <Modal isOpen={isFormOpen} onClose={closeForm} title="添加物品">
        <CreateGoodForm onClose={closeForm} />
      </Modal>
    </>
  );
}
