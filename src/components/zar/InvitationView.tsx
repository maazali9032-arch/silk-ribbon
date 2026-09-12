import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  formatDateParts,
  formatEventDate,
  galleryUrls,
  toList,
  whatsappHref,
  type ZarPayload,
} from "@/lib/zar/invitation";
import { Ornament, RibbonCorner, RibbonFrame, SilkField } from "./Ribbon";
import { Section } from "./Section";
import { BrandTicker } from "./BrandTicker";
import defaultMusicUrl from "@/leberch-romantic-584475.mp3";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

function Opening({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-8">
      <SilkField />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.6 }}
        className="relative z-10 text-center"
      >
        <h1 className="font-display text-[2.4rem] leading-[1.25] italic text-foreground">
          Two Souls
          <br />
          One Beautiful
          <br />
          Journey
        </h1>
        <div className="mt-8">
          <Ornament />
        </div>
      </motion.div>
      <motion.button
        type="button"
        onClick={onBegin}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 2, duration: 1 }, y: { duration: 2.6, repeat: Infinity } }}
        className="zar-eyebrow absolute bottom-10 z-10 cursor-pointer"
      >
        Scroll to begin
      </motion.button>
    </section>
  );
}

function Hero({
  groom,
  bride,
  invocation,
  details,
}: {
  groom?: string | null | undefined;
  bride?: string | null | undefined;
  invocation?: string | null | undefined;
  details: string[];
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-8"
    >
      <RibbonFrame play={inView} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 1.4 }}
        className="relative z-10 w-full max-w-sm text-center"
      >
        {invocation && (
          <p className="font-display mb-8 text-base italic text-muted-foreground">{invocation}</p>
        )}
        <p className="zar-eyebrow">Together Always</p>
        <div className="mt-6 space-y-1">
          {groom && (
            <h1 className="font-display text-[2.9rem] leading-[1.1] italic text-foreground">
              {groom}
            </h1>
          )}
          {groom && bride && (
            <p className="font-display text-2xl text-[color:var(--gold)]">&amp;</p>
          )}
          {bride && (
            <h1 className="font-display text-[2.9rem] leading-[1.1] italic text-foreground">
              {bride}
            </h1>
          )}
        </div>
        {details.length > 0 && (
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{details.join(" · ")}</p>
        )}
        <p className="zar-eyebrow mt-7">Are getting married</p>
      </motion.div>
    </section>
  );
}

function Photos({
  groomPhoto,
  bridePhoto,
}: {
  groomPhoto?: string | null | undefined;
  bridePhoto?: string | null | undefined;
}) {
  if (!groomPhoto && !bridePhoto) return null;
  return (
    <div className="flex justify-center gap-5">
      {[groomPhoto, bridePhoto].filter(Boolean).map((src, i) => (
        <div
          key={i}
          className="zar-card h-32 w-32 overflow-hidden rounded-full p-1 sm:h-40 sm:w-40"
        >
          <img
            src={src as string}
            alt=""
            loading="lazy"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

function Rsvp() {
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      <RibbonCorner side="left" />
      <div className="relative z-10 space-y-4">
        {(["yes", "no"] as const).map((key) => {
          const active = choice === key;
          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => setChoice(key)}
              whileTap={{ scale: reduce ? 1 : 0.97 }}
              className="zar-card font-display relative w-full overflow-hidden rounded-full px-6 py-4 text-lg italic tracking-wide"
              style={{
                background:
                  key === "yes"
                    ? "color-mix(in oklab, var(--rose) 45%, var(--card))"
                    : "color-mix(in oklab, var(--card) 78%, transparent)",
              }}
            >
              <motion.span
                aria-hidden
                initial={false}
                animate={active ? { x: ["-110%", "110%"] } : { x: "-110%" }}
                transition={{ duration: reduce ? 0.001 : 1.4, ease: "easeInOut" }}
                className="absolute inset-y-0 left-0 w-1/2"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, color-mix(in oklab, var(--gold) 55%, transparent), transparent)",
                }}
              />
              <span className="relative">
                {key === "yes" ? "Will Be There" : "Regretfully Decline"}
              </span>
            </motion.button>
          );
        })}
        <div className="min-h-14 pt-2 text-center">
          {choice && (
            <motion.p
              key={choice}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display text-base italic text-muted-foreground"
            >
              {choice === "yes"
                ? "A ribbon has been tied in your name — we cannot wait to see you."
                : "You will be missed, and held warmly in our thoughts."}
            </motion.p>
          )}
        </div>
      </div>
      <RibbonCorner side="right" />
    </div>
  );
}

function MusicToggle({ url }: { url?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const wasPlayingRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (!audio.paused) {
          wasPlayingRef.current = true;
          audio.pause();
        }
      } else {
        if (wasPlayingRef.current) {
          wasPlayingRef.current = false;
          void audio.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing]);

  const musicSource = url || defaultMusicUrl;

  return (
    <>
      <audio ref={audioRef} src={musicSource} loop preload="none" />
      <button
        type="button"
        onClick={() => setPlaying(!playing)}
        className="zar-card zar-eyebrow fixed right-4 top-4 z-40 rounded-full px-3 py-2"
      >
        {playing ? "Pause music" : "Play music"}
      </button>
    </>
  );
}

export function InvitationView({ payload }: { payload: ZarPayload }) {
  const c = payload.content ?? {};
  const openingRef = useRef<HTMLDivElement>(null);

  const date = formatDateParts(c.wedding_date);
  const events = (c.events ?? []).filter((e) => e && (e.title || e.name));
  const photos = galleryUrls(c.gallery);
  const contacts = (c.contacts ?? []).filter((x) => x?.phone).slice(0, 2);
  const groomParents = toList(c.groom_parents);
  const brideParents = toList(c.bride_parents);
  const relatives = toList(c.relatives);
  const heroDetails = [
    c.groom_qualification,
    c.groom_occupation,
    c.bride_qualification,
    c.bride_occupation,
  ].filter((v): v is string => Boolean(v && v.trim()));

  return (
    <div ref={openingRef} className="relative">
      <BrandTicker brandName={payload.brandName} />
      {c.music_enabled && <MusicToggle url={c.music_url || undefined} />}

      <Opening
        onBegin={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
      />

      <Hero
        groom={c.groom_name}
        bride={c.bride_name}
        invocation={c.invocation}
        details={heroDetails}
      />

      {(c.groom_photo || c.bride_photo) && (
        <Section eyebrow="A glimpse of us" divider>
          <Photos groomPhoto={c.groom_photo} bridePhoto={c.bride_photo} />
        </Section>
      )}

      {date && (
        <Section eyebrow="Save the date" flipDivider>
          <div className="zar-card mx-auto max-w-xs rounded-2xl px-8 py-10 text-center">
            <p className="zar-eyebrow">{date.weekday}</p>
            <p className="font-display my-2 text-6xl leading-none text-foreground">{date.day}</p>
            <p className="zar-eyebrow">
              {date.month} {date.year}
            </p>
          </div>
        </Section>
      )}

      {(c.message || groomParents.length > 0 || brideParents.length > 0 || relatives.length > 0) && (
        <Section title="Our Families" eyebrow="With blessings">
          <div className="zar-card rounded-2xl px-6 py-8 text-center">
            {c.message && (
              <p className="font-display text-lg leading-relaxed italic text-foreground">
                {c.message}
              </p>
            )}
            {(groomParents.length > 0 || brideParents.length > 0) && (
              <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
                {groomParents.length > 0 && (
                  <div>
                    <p className="zar-eyebrow mb-2">Groom&apos;s parents</p>
                    {groomParents.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
                {brideParents.length > 0 && (
                  <div>
                    <p className="zar-eyebrow mb-2">Bride&apos;s parents</p>
                    {brideParents.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
            {relatives.length > 0 && (
              <div className="mt-8">
                <p className="zar-eyebrow mb-2">Together with our family</p>
                <p className="text-sm leading-relaxed">{relatives.join(" · ")}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {events.length > 0 && (
        <Section title="Wedding Events" eyebrow="Join us in our celebrations" flipDivider>
          <ul className="space-y-7">
            {events.map((e, i) => (
              <li key={i} className="relative pl-6">
                <span className="absolute left-0 top-2 h-2 w-2 rotate-45 bg-[color:var(--gold)]" />
                <p className="font-display text-xl italic">{e.title ?? e.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {[formatEventDate(e.date), e.time].filter(Boolean).join(" | ")}
                </p>
                {(e.venue || e.address) && (
                  <p className="text-sm text-muted-foreground">
                    {[e.venue, e.address].filter(Boolean).join(", ")}
                  </p>
                )}
                {e.note && <p className="mt-1 text-xs italic text-muted-foreground">{e.note}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(c.venue_name || c.venue_address) && (
        <Section title="Venue" eyebrow="We would love to see you there">
          <div className="zar-card overflow-hidden rounded-2xl">
            {c.venue_image && (
              <img
                src={c.venue_image}
                alt={c.venue_name ?? "Venue"}
                loading="lazy"
                className="h-48 w-full object-cover"
              />
            )}
            <div className="px-6 py-7 text-center">
              {c.venue_name && <p className="font-display text-2xl italic">{c.venue_name}</p>}
              {(c.venue_address || c.venue_city) && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {[c.venue_address, c.venue_city].filter(Boolean).join(", ")}
                </p>
              )}
              {c.venue_maps_url && (
                <a
                  href={c.venue_maps_url}
                  {...ext}
                  className="zar-eyebrow mt-6 inline-block rounded-full border border-[color:var(--gold)]/50 px-6 py-3"
                  style={{ background: "color-mix(in oklab, var(--rose) 30%, transparent)" }}
                >
                  Get directions
                </a>
              )}
            </div>
          </div>
        </Section>
      )}

      {photos.length > 0 && (
        <Section title="Our Memories" eyebrow="A glimpse of our journey" flipDivider>
          <div className="grid grid-cols-2 gap-3">
            {photos.slice(0, 6).map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                loading="lazy"
                className="h-40 w-full rounded-xl object-cover shadow-[var(--shadow-silk)]"
              />
            ))}
          </div>
        </Section>
      )}

      <Section title="Will You Be There?" eyebrow="Your presence means the world to us">
        <Rsvp />
      </Section>

      {contacts.length > 0 && (
        <Section eyebrow="For any assistance" flipDivider>
          <div className="grid gap-4 sm:grid-cols-2">
            {contacts.map((contact, i) => {
              const wa = whatsappHref(contact);
              return (
                <div key={i} className="zar-card rounded-2xl px-5 py-5 text-center">
                  {contact.name && <p className="font-display text-lg italic">{contact.name}</p>}
                  {contact.role && <p className="zar-eyebrow mt-1">{contact.role}</p>}
                  <div className="mt-4 flex justify-center gap-3">
                    <a
                      href={`tel:${contact.phone}`}
                      className="zar-eyebrow rounded-full border border-[color:var(--gold)]/50 px-4 py-2"
                    >
                      Call
                    </a>
                    {wa && (
                      <a
                        href={wa}
                        {...ext}
                        className="zar-eyebrow rounded-full border border-[color:var(--gold)]/50 px-4 py-2"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      <footer className="relative overflow-hidden py-20 text-center">
        <SilkField />
        <div className="relative z-10">
          <Ornament />
          <p className="font-display mt-6 text-xl italic text-muted-foreground">
            Where love meets art
          </p>
        </div>
      </footer>
    </div>
  );
}
