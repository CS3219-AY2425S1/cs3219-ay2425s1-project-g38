import SettingsPage from "./page";

export default async function SettingsLayout() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:pb-10 h-full">
      <div className="inline-block text-center justify-center w-full h-full">
        <SettingsPage />
      </div>
    </section>
  );
}
