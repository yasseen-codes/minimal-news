// components/Footer.tsx

import Link from "next/link"; // Import Link for navigation

export function Footer() {
  return (
    // Footer container with flex layout to justify content between
    <footer className="text-muted-foreground mx-4 my-6 flex items-center justify-between p-2 text-sm md:mx-25 md:my-15 md:text-base">
      <div className="flex items-center gap-4">
        <Link
          href="https://linkedin.com/in/yasseen-aborasheed-11592a236" // <-- Replace with your LinkedIn profile URL
          target="_blank" // Open in a new tab
          rel="noopener noreferrer" // Security best practice for external links
          className="hover:text-accent font-mono" // Apply mono font and hover underline
        >
          LinkedIn
        </Link>

        <Link
          href="https://github.com/yasseen-codes" // <-- Replace with your GitHub profile URL
          target="_blank" // Open in a new tab
          rel="noopener noreferrer" // Security best practice for external links
          className="hover:text-accent font-mono" // Apply mono font and hover underline
        >
          GitHub
        </Link>
      </div>

      <Link
        href="/"
        target="_blank" // Open in a new tab
        rel="noopener noreferrer" // Security best practice for external links
        className="hover:text-accent font-mono"
      >
        Source Code
      </Link>
    </footer>
  );
}
