import React from "react";

import Logo from "@/components/logo";
import Nav from "@/components/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="mx-7 my-7 flex items-center justify-between md:mx-25 md:my-15">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-2 md:gap-5">
          <Nav />
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-7 my-10 md:mx-25 md:my-15">{children}</main>
    </>
  );
}

export default Layout;
