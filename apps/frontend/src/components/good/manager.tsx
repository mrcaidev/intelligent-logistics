import { Button } from "components/form";
import { Modal } from "components/modal";
import { useBoolean } from "hooks/use-boolean";
import { useGoods } from "hooks/use-goods";
import { Plus } from "react-feather";
import { CreateGoodForm } from "./create-form";
import { DeliverGoodButton } from "./deliver-button";
import { GoodList } from "./list";

export function GoodManager() {
  const { goods } = useGoods();
  const { value: isOpen, on: open, off: close } = useBoolean();

  return (
    <>
      <GoodList openForm={open} />
      <div className="grid grid-cols-2 gap-3 px-4">
        <Button
          colorScheme="gray"
          variant="dim"
          icon={Plus}
          disabled={!goods}
          onClick={open}
        >
          添加
        </Button>
        <DeliverGoodButton />
      </div>
      <Modal isOpen={isOpen} onClose={close} title="添加物品">
        <CreateGoodForm onClose={close} />
      </Modal>
    </>
  );
}
