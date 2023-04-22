import {
  Calendar,
  ChevronRight,
  Map,
  MapPin,
  Package,
  User,
} from "react-feather";

type Props = {
  id: string;
  name: string;
  createdAt: number;
  sourceId: string;
  targetId: string;
  isVip: boolean;
  graphId: string;
};

export function Good({
  name,
  createdAt,
  sourceId,
  targetId,
  isVip,
  graphId,
}: Props) {
  return (
    <details className="group rounded open:bg-gray-300">
      <summary className="flex items-center gap-3 px-4 py-3 rounded font-bold text-sm hover:bg-gray-300 cursor-pointer">
        <Package size={16} />
        {name}
        <ChevronRight
          size={16}
          className="ml-auto group-open:rotate-90 transition-transform"
        />
      </summary>
      <ul className="pb-1">
        <li className="flex items-center gap-3 px-4 py-2 text-xs">
          <Calendar size={16} />
          {new Date(createdAt).toLocaleString("zh")}
        </li>
        <li className="flex items-center gap-3 px-4 py-2 text-xs">
          <MapPin size={16} />
          {sourceId} - {targetId}
        </li>
        <li className="flex items-center gap-3 px-4 py-2 text-xs">
          <Map size={16} />
          {graphId}
        </li>
        {isVip && (
          <li className="flex items-center gap-3 px-4 py-2 text-xs">
            <User size={16} />
            VIP 用户
          </li>
        )}
      </ul>
    </details>
  );
}
