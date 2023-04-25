import { Button } from "components/form";
import { useGlobalState } from "contexts/global-state";
import { useGoods } from "hooks/use-goods";
import { usePost } from "hooks/use-mutation";
import { Send } from "react-feather";
import { toast } from "react-toastify";
import { Good } from "shared-types";

type Result = { good: Good; path: string[] };

export function DeliverGoodButton() {
  const { dispatch } = useGlobalState();
  const { goods, mutate } = useGoods();

  const { trigger, isMutating } = usePost<never, Result>("/goods/deliver");

  const handleClick = async () => {
    const data = await trigger();
    if (!data) {
      return;
    }
    await mutate();
    dispatch({ type: "SET_ACTIVE_IDS", payload: data.path });
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
