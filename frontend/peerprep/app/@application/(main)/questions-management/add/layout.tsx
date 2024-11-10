export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-start justify-center gap-4 py-8 md:py-6">
      <div className="inline-block w-full min-w-lg text-center justify-center">
        {children}
      </div>
    </section>
  );
}
