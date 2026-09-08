import { Ornament, SilkField } from "./Ribbon";
import { BrandTicker } from "./BrandTicker";

function Shell({
  title,
  body,
  children,
  brandName,
}: {
  title: string;
  body?: string | null;
  children?: React.ReactNode;
  brandName?: string | null;
}) {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-8">
      <SilkField />
      <BrandTicker brandName={brandName ?? null} />
      <div className="relative z-10 max-w-sm text-center">
        <h1 className="font-display text-3xl italic leading-snug text-foreground">{title}</h1>
        {body && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{body}</p>}
        <div className="mt-8">
          <Ornament />
        </div>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </main>
  );
}

export function LoadingState() {
  return <Shell title="Unfolding the silk…" />;
}

export function NotFoundState() {
  return (
    <Shell
      title="This invitation could not be found"
      body="The ribbon leads nowhere. Please check the link you were given, or ask your host to share it again."
    />
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Shell
      title="The silk did not settle"
      body="We could not load this invitation just now. Please try again in a moment."
    >
      <button
        type="button"
        onClick={onRetry}
        className="zar-card zar-eyebrow rounded-full px-6 py-3"
      >
        Try again
      </button>
    </Shell>
  );
}

export function FallbackState({
  title,
  message,
  note,
  brandName,
}: {
  title?: string | null;
  message?: string | null;
  note?: string | null;
  brandName?: string | null;
}) {
  return (
    <Shell
      title={title?.trim() || "This invitation is no longer available"}
      body={message?.trim() || "Please contact your host for the current invitation link."}
      brandName={brandName ?? null}
    >
      {note && <p className="zar-eyebrow">{note}</p>}
    </Shell>
  );
}
