// components/Footer.tsx

import { CodeXml, Github, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="text-muted-foreground mx-4 my-6 flex items-center justify-between p-2 text-sm md:mx-25 md:my-10 md:text-base">
      <div className="flex items-center gap-4">
        <Link
          href="https://linkedin.com/in/yasseen-aborasheed-11592a236"
          target="_blank" // Open in a new tab
          rel="noopener noreferrer" // Security best practice for external links
          className="hover:text-accent flex items-center gap-1 font-mono"
        >
          <Linkedin size={16} className="sr-only md:not-sr-only" />
          LinkedIn
        </Link>
        <Link
          href="https://github.com/yasseen-codes"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent flex items-center gap-1 font-mono"
        >
          <Github size={16} className="sr-only md:not-sr-only" />
          GitHub
        </Link>
      </div>
      <Link
        href="https://github.com/yasseen-codes/minimal-news.git"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-accent flex items-center gap-1 font-mono"
      >
        Source Code
        <CodeXml size={20} className="sr-only md:not-sr-only" />
      </Link>
    </footer>
  );
}
