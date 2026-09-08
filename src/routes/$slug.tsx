import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchInvitation, readSlug } from "@/lib/zar/invitation";
import { InvitationView } from "@/components/zar/InvitationView";
import { ErrorState, FallbackState, LoadingState, NotFoundState } from "@/components/zar/States";

export const Route = createFileRoute("/$slug")({
  head: () => ({
    meta: [
      { title: "Wedding Invitation — ZAR" },
      {
        name: "description",
        content:
          "A digital wedding invitation woven from flowing silk ribbons. Events, venue, memories and RSVP in one elegant page.",
      },
      { property: "og:title", content: "Wedding Invitation — ZAR" },
      {
        property: "og:description",
        content: "A digital wedding invitation woven from flowing silk ribbons.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvitationRoute,
});

function InvitationRoute() {
  const { slug: rawSlug } = Route.useParams();
  const slug = readSlug(`/${rawSlug}`);

  const query = useQuery({
    queryKey: ["zar-invitation", slug],
    queryFn: () => fetchInvitation(slug as string),
    enabled: Boolean(slug),
    retry: 1,
    staleTime: 60_000,
  });

  if (!slug) return <NotFoundState />;
  if (query.isPending) return <LoadingState />;
  if (query.isError) return <ErrorState onRetry={() => void query.refetch()} />;

  const payload = query.data;
  if (payload.state === "fallback") {
    return (
      <FallbackState
        title={payload.fallback?.title ?? null}
        message={payload.fallback?.message ?? null}
        note={payload.fallback?.note ?? null}
        brandName={payload.brandName}
      />
    );
  }
  if (payload.state !== "live" || !payload.content) return <NotFoundState />;

  return (
    <main>
      <InvitationView payload={payload} />
    </main>
  );
}
