import { Button } from "components/form";
import { useDelete } from "hooks/use-mutation";
import { useNodes } from "hooks/use-nodes";
import { Trash2 } from "react-feather";

type Props = {
  id: string;
};

export function NodeRemover({ id }: Props) {
  const { mutate } = useNodes();

  const { trigger, isMutating } = useDelete("/nodes/" + id);

  const handleClick = async () => {
    await trigger();
    await mutate();
  };

  return (
    <Button
      colorScheme="red"
      icon={Trash2}
      isLoading={isMutating}
      onClick={handleClick}
    >
      删除节点
    </Button>
  );
}
