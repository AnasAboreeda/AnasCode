import { ReactNode } from "react";
import Nav from "../molecules/Nav";
import Footer from "../molecules/Footer";

type SingleColumnProps = {
  children: ReactNode;
};

export default function SingleColumn({ children }: SingleColumnProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:text-white focus:rounded"
        style={{ backgroundColor: "var(--color-brand)" }}
      >
        Skip to content
      </a>
      <Nav />
      <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-6">
        <main id="main-content">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
