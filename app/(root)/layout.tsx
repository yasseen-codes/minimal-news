import React from "react";

import Logo from "@/components/logo";
import Nav from "@/components/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Footer } from "@/components/footer";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="mx-4 my-4 flex items-center justify-between p-2 md:mx-25 md:my-10">
        <Link href="/top/1">
          <Logo />
        </Link>
        <div className="flex items-center gap-2 md:gap-5">
          <Nav />
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-4 my-6 p-2 md:mx-25 md:my-10">{children}</main>
      {/* TODO: fix the footer position by making the body take 50% height */}
      <Footer />
    </>
  );
}

export default Layout;
