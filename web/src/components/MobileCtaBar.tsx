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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md md:hidden"
    >
      <div className="grid grid-cols-2 gap-2 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <a
          href={`tel:${contact.phone.replace(/-/g, "")}`}
          className="btn btn-primary w-full"
        >
          전화 상담
        </a>
        <a
          href={contact.kakaoOpenChatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline w-full"
        >
          카톡 상담
        </a>
      </div>
    </nav>
  );
}
