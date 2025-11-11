export default async function Post({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  return (
    <div>
      <h1>Post {postId}</h1>
    </div>
  );
}