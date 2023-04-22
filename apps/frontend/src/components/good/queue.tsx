import { Good } from "./good";

export function GoodQueue() {
  return (
    <ul className="space-y-1 px-4 mr-0.5 overflow-auto scrollbar scrollbar-rounded scrollbar-track-color-transparent scrollbar-thumb-color-gray-400">
      <li>
        <Good
          id="lwjkl2jk3j"
          name="牛肉"
          createdAt={new Date().getTime()}
          sourceId="上海"
          targetId="巴黎"
          isVip={true}
          graphId="23jkh4hwef"
        />
      </li>
      <li>
        <Good
          id="ldsafrggeg"
          name="牛肉"
          createdAt={new Date().getTime()}
          sourceId="上海"
          targetId="巴黎"
          isVip={true}
          graphId="23jkh4hwef"
        />
      </li>
    </ul>
  );
}
