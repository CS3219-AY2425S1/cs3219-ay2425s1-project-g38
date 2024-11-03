import SettingsPage from "./page";

import { getEmail, getUsername } from "@/auth/actions";

export default async function SettingsLayout() {
  const username = await getUsername();
  const email = await getEmail();

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full">
      <div className="inline-block text-center justify-center w-full h-full">
        <SettingsPage />
      </div>
    </section>
  );
}
