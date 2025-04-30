# **Minimal News**

A fast, minimal, and eye-relaxed Hacker News reader built with Next.js and Tailwind CSS. This project focuses on a clean user interface and efficient data fetching using modern web technologies.

[Minimal News](https://minimal-news-seven.vercel.app/)

## **🚀 Features**

- Browse Top, New, Ask HN, Show HN, and Job stories.
- View individual story details and comments.
- Responsive design for various screen sizes.
- Eye-relaxed theme for comfortable reading.
- Dynamic metadata and basic SEO implementation.
- Independent loading states for content and pagination using Suspense.
- Subtle entry animations for a smoother user experience.

## **✨ Technologies Used**

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Animations:** tw-animate-css
- **Data Fetching:** Server Components, fetch API, Internal API Routes
- **External API:** Hacker News API

## **⚙️ Setup**

To run this project locally:

1. Clone the repository:

   ```terminal
   git clone https://github.com/yasseen-codes/minimal-news.git
   cd minimal-news
   ```

2. Install dependencies using pnpm (or npm/yarn):

   ```terminal
   pnpm install
   ```

3. Create a .env.local file in the root directory and add your site URL (for API routes and metadata):

   ```env
   NEXT_PUBLIC_SITE_URL=<http://localhost:3000>
   ```

   (Remember to update this to your deployed URL when deploying)

4. Run the development server:

   ```terminal
   pnpm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## **📚 What I Learned**

Building this Minimal News app has been a fantastic journey into modern web development practices, especially with the Next.js App Router\! Here are some key takeaways:

- **Next.js App Router Fundamentals:** Deepened understanding of the new routing paradigm, layouts, pages, and how they interact.
- **Server Components vs. Client Components:** Learned when and why to use each, understanding the trade-offs between server-side rendering benefits (performance, SEO) and client-side interactivity requirements (state, event handlers).
- **Data Fetching in the App Router:** Mastered fetching data directly in Server Components and pages, leveraging async/await and the native fetch API.
- **Suspense for Loading States:** Effectively used \<Suspense\> boundaries to manage loading states for different parts of the UI (story list, pagination, story details), showing instant fallbacks while data loads.
- **API Routes:** Built internal API routes to fetch data from the external Hacker News API, providing a backend layer for the frontend components.
- **Metadata API:** Implemented dynamic titles, descriptions, and other meta tags using the built-in metadata object and generateMetadata function for improved SEO and social sharing.
- **SEO Best Practices:** Applied fundamental SEO concepts like robots.txt, sitemap.xml, and structured data hints via Open Graph.
- **Component Composition:** Improved code structure by separating concerns into smaller, reusable components (e.g., StoriesContent, PaginationLoader, StoryDetailsLoader).
- **Styling with Tailwind CSS & Shadcn UI:** Gained more experience in building a responsive and visually appealing UI rapidly using utility-first CSS and a component library.
- **CSS Animations:** Integrated CSS animations using tw-animate-css and learned how they interact with React rendering and Suspense.
- **Refactoring for Simplicity:** Identified opportunities to simplify code by consolidating logic (like the dynamic list page route) and separating components (like pagination).

Overall, this project solidified my understanding of building fast, modern, and maintainable web applications with the latest Next.js features\!

## **🙏 Acknowledgements**

- [Hacker News API](https://github.com/HackerNews/API)
- [hckrnws](https://www.hckrnws.com/top/1)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [tw-animate-css](https://github.com/internaljp/tw-animate-css)

Feel free to explore the code and provide feedback\!
