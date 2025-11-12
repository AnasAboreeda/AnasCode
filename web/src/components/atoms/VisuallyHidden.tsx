import { ReactNode } from "react";

type VisuallyHiddenProps = {
  children: ReactNode;
};

export default function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return (
    <span className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
      {children}
    </span>
  );
}
