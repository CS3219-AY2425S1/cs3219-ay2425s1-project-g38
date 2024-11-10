// components/ForbiddenLayout.js
export default function ForbiddenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">{children}</div>
    </div>
  );
}
