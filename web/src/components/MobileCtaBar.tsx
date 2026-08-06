import { apiFetch } from "@/lib/api";
import type { Contact } from "@/lib/types";

export default async function MobileCtaBar() {
  let contact: Contact | null = null;

  try {
    contact = await apiFetch<Contact>("/api/contact");
  } catch {
    contact = null;
  }

  if (!contact) return null;

  return (
    <nav
      aria-label="상담 바로가기"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-black/10 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden dark:border-white/10 dark:bg-zinc-950"
    >
      <a
        href={`tel:${contact.phone.replace(/-/g, "")}`}
        className="flex h-14 items-center justify-center rounded-xl bg-blue-700 text-base font-semibold text-white"
      >
        전화 상담
      </a>
      <a
        href={contact.kakaoOpenChatUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 items-center justify-center rounded-xl border border-black/15 text-base font-semibold dark:border-white/20"
      >
        카톡 상담
      </a>
    </nav>
  );
}
