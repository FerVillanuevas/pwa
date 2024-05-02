export default function ProductLayout({
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
    <div className="container space-y-8">
      {children}

      {complete}

      {maylike}

      {recently_viewed}
    </div>
  );
}
