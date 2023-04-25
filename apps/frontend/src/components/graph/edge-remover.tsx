import { Button } from "components/form";
import { useEdges } from "hooks/use-edges";
import { useDelete } from "hooks/use-mutation";
import { Trash2 } from "react-feather";

type Props = {
  id: string;
};

export function EdgeRemover({ id }: Props) {
  const { mutate } = useEdges();

  const { trigger, isMutating } = useDelete("/edges/" + id);

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
      删除道路
    </Button>
  );
}
