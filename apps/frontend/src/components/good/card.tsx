import { Good } from "common";
import { useGraphs } from "hooks/use-graphs";
import {
  Calendar,
  ChevronRight,
  Map,
  MapPin,
  Package,
  User,
} from "react-feather";

export function GoodCard({
  name,
  createdAt,
  source,
  target,
  isVip,
  graphId,
}: Good) {
  const { data } = useGraphs();

  const graphName = data?.find((graph) => graph.id === graphId)?.name;

  return (
    <details className="group rounded border border-gray-300 open:bg-gray-300">
      <summary className="flex items-center gap-3 px-4 py-3 rounded font-bold text-sm hover:bg-gray-300 transition-colors cursor-pointer">
        <Package size={16} />
        {name}
        <ChevronRight
          size={16}
          className="ml-auto group-open:rotate-90 transition-transform"
        />
      </summary>
      <ul className="mx-2 py-1 border-t border-gray-400/40 text-xs">
        <li className="flex items-center gap-3 p-2">
          <Calendar size={16} />
          {new Date(createdAt).toLocaleString("zh")}
        </li>
        <li className="flex items-center gap-3 p-2">
          <MapPin size={16} />
          {source} - {target}
        </li>
        <li className="flex items-center gap-3 p-2">
          <Map size={16} />
          {graphName || "未知方案"}
        </li>
        {isVip && (
          <li className="flex items-center gap-3 p-2">
            <User size={16} />
            VIP 用户
          </li>
        )}
      </ul>
    </details>
  );
}
