import { createFileRoute } from "@tanstack/react-router";
import { Ornament, SilkField } from "@/components/zar/Ribbon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZAR — Digital Wedding Invitations" },
      {
        name: "description",
        content:
          "ZAR crafts digital wedding invitations woven from flowing silk ribbons. Open your personal invitation link to view yours.",
      },
      { property: "og:title", content: "ZAR — Digital Wedding Invitations" },
      {
        property: "og:description",
        content: "Digital wedding invitations woven from flowing silk ribbons.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

// No invitation is ever shown at "/" — an invitation is selected only by its slug.
function Landing() {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-8">
      <SilkField />
      <div className="relative z-10 max-w-sm text-center">
        <p className="zar-eyebrow">Elegant · Modern · Timeless</p>
        <h1 className="font-display mt-5 text-4xl italic leading-snug text-foreground">
          Ribbons that weave
          <br />a story of love
        </h1>
        <div className="mt-8">
          <Ornament />
        </div>
        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          Please open the personal invitation link shared with you to view the invitation.
        </p>
      </div>
    </main>
  );
}
