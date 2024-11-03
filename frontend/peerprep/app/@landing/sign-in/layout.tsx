export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="inline-block w-full min-w-lg text-center justify-center">
      {children}
    </div>
  );
}
