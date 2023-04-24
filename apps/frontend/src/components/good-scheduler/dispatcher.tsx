import { Button } from "components/form";
import { useGraph } from "components/graph";
import { useGoods } from "hooks/use-goods";
import { Send } from "react-feather";
import { toast } from "react-toastify";
import { Good } from "shared-types";
import useSWRMutation from "swr/mutation";
import { fetcher } from "utils/fetch";

async function deliver(url: string) {
  return fetcher<{ good: Good; nodes: string[]; edgeIds: string[] }>(url, {
    method: "POST",
  });
}

export function GoodDispatcher() {
  const { goods, mutate } = useGoods();
  const { setActiveIds } = useGraph();

  const { trigger, isMutating } = useSWRMutation("/goods/deliver", deliver);

  const handleClick = async () => {
    try {
      const data = await trigger();
      if (!data) {
        return;
      }
      await mutate();
      setActiveIds([...data.nodes, ...data.edgeIds]);
      toast.success("成功发送物品：" + data.good.name);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Button
      icon={Send}
      isLoading={isMutating}
      disabled={goods?.length === 0}
      onClick={handleClick}
    >
      发货
    </Button>
  );
}
