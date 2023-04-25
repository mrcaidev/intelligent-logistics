import { Button } from "components/form";
import { useGlobalState } from "contexts/global-state";
import { useGoods } from "hooks/use-goods";
import { Send } from "react-feather";
import { toast } from "react-toastify";
import { Good } from "shared-types";
import useSWRMutation from "swr/mutation";
import { fetcher } from "utils/fetch";

async function deliver(url: string) {
  return fetcher<{ good: Good; path: string[] }>(url, {
    method: "POST",
  });
}

export function GoodDispatcher() {
  const { setActiveIds } = useGlobalState();
  const { goods, mutate } = useGoods();

  const { trigger, isMutating } = useSWRMutation("/goods/deliver", deliver);

  const handleClick = async () => {
    const data = await trigger();
    if (!data) {
      return;
    }
    await mutate();
    setActiveIds(data.path);
    toast.success("成功发送物品：" + data.good.name);
  };

  return (
    <Button
      icon={Send}
      isLoading={isMutating}
      disabled={!goods || goods.length === 0}
      onClick={handleClick}
    >
      发货
    </Button>
  );
}
