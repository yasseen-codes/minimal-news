import Stories from "@/components/stories";

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const page = parseInt((await params).page || "1");
  return <Stories page={page} route="new" />;
}
