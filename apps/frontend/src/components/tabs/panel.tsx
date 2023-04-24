import { PropsWithChildren } from "react";
import { useTab } from "./tabs";

type Props = PropsWithChildren<{
  name: string;
}>;

export function TabPanel({ name, children }: Props) {
  const tab = useTab();

  if (tab !== name) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      aria-labelledby={"tab-" + name}
      id={"tabpanel-" + name}
      className="grow flex flex-col"
    >
      {children}
    </div>
  );
}
