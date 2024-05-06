
export default async function ProductLayout({
  children,
  complete,
  maylike,
  recently_viewed,
}: {
  children: React.ReactNode;
  complete: React.ReactNode;
  maylike: React.ReactNode;
  recently_viewed: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      {children}

      {complete}

      {maylike}

      {recently_viewed}
    </div>
  );
}
