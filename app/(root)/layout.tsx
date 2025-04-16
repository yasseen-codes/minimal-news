import React from "react";

import Logo from "@/components/logo";
import Nav from "@/components/Nav";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="flex justify-between items-center p-5">
        <Logo />
        <Nav />
      </header>
      <main>{children}</main>
    </>
  );
}

export default Layout;
