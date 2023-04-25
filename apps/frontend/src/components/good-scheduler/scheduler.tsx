import { Button } from "components/form";
import { Modal } from "components/modal";
import { useBoolean } from "hooks/use-boolean";
import { useGoods } from "hooks/use-goods";
import { Plus } from "react-feather";
import { GoodCreatorForm } from "./creator-form";
import { GoodDispatcher } from "./dispatcher";
import { GoodList } from "./list";

export function GoodScheduler() {
  const { goods } = useGoods();
  const { value: isFormOpen, on: openForm, off: closeForm } = useBoolean();

  return (
    <>
      <GoodList openForm={openForm} />
      <div className="grid grid-cols-2 gap-3 px-4">
        <Button
          colorScheme="gray"
          variant="dim"
          icon={Plus}
          disabled={!goods}
          onClick={openForm}
        >
          添加
        </Button>
        <GoodDispatcher />
      </div>
      <Modal isOpen={isFormOpen} onClose={closeForm} title="添加物品">
        <GoodCreatorForm onClose={closeForm} />
      </Modal>
    </>
  );
}
