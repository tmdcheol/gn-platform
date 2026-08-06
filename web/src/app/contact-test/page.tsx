import { apiFetch } from "@/lib/api";
import type { Contact } from "@/lib/types";

export default async function ContactTestPage() {
  let contact: Contact | null = null;
  let error: string | null = null;

  try {
    contact = await apiFetch<Contact>("/api/contact");
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="p-8 font-mono text-sm">
      <h1 className="mb-4 text-lg font-bold">/api/contact</h1>
      {error ? (
        <p className="text-red-600">연락처를 불러오지 못했습니다: {error}</p>
      ) : (
        <pre>{JSON.stringify(contact, null, 2)}</pre>
      )}
    </main>
  );
}
