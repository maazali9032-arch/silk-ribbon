# Silk Ribbon Invites

# ZAR V2 — LOVABLE DESIGN IMPLEMENTATION PROMPT

## Shared Non-Negotiable Contract for Every Design




You are building ONE public ZAR V2 digital wedding invitation design application. This prompt is the complete implementation contract for this design. Do not reinterpret, merge, simplify, replace, or cross-pollinate this design with another ZAR design.




## 1. Product boundary




Build only the public invitation frontend for this design.




This is NOT:

- the ZAR admin dashboard

- a Shop Owner dashboard

- an authentication application

- a SaaS editor

- a payment system

- a guest account system

- a separate database

- a separate Supabase project

- a separate deployment per wedding




Guests never log in. They open the invitation URL directly.




The design must remain an independently deployable Vite + React + TypeScript + Tailwind application and must be deployable to Vercel.




## 2. Exact technology




Use:

- Vite

- React

- TypeScript

- Tailwind CSS

- Motion / Framer Motion where useful

- SVG/CSS for precise ornamental construction and line drawing

- Supabase client only for the approved public RPC

- React Router only if genuinely needed




Do NOT use Next.js.




Do NOT replace the requested construction animation with a video background.




## 3. ZAR public-data contract — do not violate it




Use the central ZAR V2 Supabase project only.




The browser may use ONLY:

```env

VITE_SUPABASE_URL=

VITE_SUPABASE_ANON_KEY=

```




Both are placeholders in `.env.example`. Never place real credentials in source code.




Never use:

- service-role keys

- `SUPABASE_SERVICE_ROLE_KEY`

- `VITE_SUPABASE_SERVICE_ROLE_KEY`

- another Supabase project

- a design-specific table

- a per-shop database

- direct browser queries to invitation/content/shop/design tables

- browser-selected table/schema/design suffix/database

- localStorage/query/hash as an invitation selector




Fetch public invitation data only through:

```ts

const { data, error } = await supabase.rpc("get_public_invitation_content", {

  p_slug: slug,

});

```




Normalize a response that may be directly returned or wrapped in `{ data: ... }`.




## 4. Exact public route




Every invitation is selected ONLY by the final non-empty pathname segment:




```text

/:slug

```




Safely decode it.




Malformed percent encoding => `not_found`.




Reject empty slug or decoded slug containing `/` or `\`.




Never use:

- `?slug=`

- hash

- localStorage

- a default/sample slug

- a previous invitation

- “latest wedding”

- first available wedding

- fallback wedding data




Configure Vercel SPA rewriting so direct refreshes of `/:slug` work.




## 5. Lifecycle states




The RPC is the authority.




### live

Render only the returned wedding invitation.




### fallback

Render ONLY safe shop fallback information returned by the RPC. Never show wedding names, dates, photos, venue, events, gallery, QR, or another customer's data.




### not_found

Show a proper design-language not-found screen. Do not redirect or substitute another invitation.




### network/config/RPC error

Show a restrained retry-friendly error screen.




Never manufacture wedding data.




## 6. Dynamic content




The visual design must be data-driven. At minimum support the approved invitation payload where present:

- groom/bride names

- groom/bride photos

- qualifications

- occupations

- parents

- relatives

- invocation

- wedding date

- invitation start/end

- events

- venue name/address/city/maps URL/venue image

- gallery

- music

- contacts

- QR label / public URL as returned by the RPC contract




Optional content disappears cleanly when absent. Do not leave empty frames, broken placeholders, “undefined”, or sample wedding content.




For the couple-name hero, when both names exist use:

GROOM NAME

&

BRIDE NAME

as three separate centered lines. The ampersand is visually isolated. If one name is absent, hide the ampersand.




Do not duplicate the date unnecessarily.




## 7. Contacts




Render only approved `content.contacts`.




Maximum two contacts.




Render a contact only when a phone exists.




Call action uses `tel:`.




WhatsApp must use the supplied WhatsApp URL when present, or derive a digits-only WhatsApp destination from that same contact's phone.




Never use hardcoded shop contacts or unrelated contact information during live state.




External links open safely with:

`target="_blank"` and `rel="noopener noreferrer"`.




## 8. Venue




Show venue details only when supplied.




Show a Directions action only when a valid maps URL is returned.




Never invent coordinates or a maps URL.




## 9. Music




Music is optional and must respect the returned enabled/content state. Do not force autoplay that violates browser restrictions. Start audio only after an appropriate user interaction if required.




## 10. RSVP — LOCKED PLATFORM RULE




RSVP is animation only.




Provide exactly two choices:

- Will Be There

- Regretfully Decline




The click produces a beautiful design-specific feedback animation/state.




Do NOT:

- save RSVP clicks

- create guest accounts

- count guests

- collect number of guests

- collect RSVP names

- collect messages

- show percentages

- show RSVP analytics

- create RSVP database records




## 11. QR




If this design uses QR, it must consume the exact returned:

`invitation.public_url`




Never guess or reconstruct the URL.




Do not change the QR matrix, encoded URL, finder patterns, or QR generation contract merely for decoration. Decorative framing may be design-specific.




## 12. GLOBAL FLOATING SHOP/BRAND STRIP — REQUIRED ON EVERY DESIGN




Every ZAR public invitation must contain a very thin floating semi-transparent horizontal brand ticker.




This is NOT a banner.




Visual placement on mobile:

- approximately 69% of viewport height remains ABOVE the strip

- the strip itself is extremely thin, approximately 1–2% of viewport height

- approximately 29% of viewport height remains BELOW it

- think of it as a delicate floating line/ribbon around the 70% viewport-height mark




The exact vertical position should be responsive and should not obscure important invitation content.




The strip must:

- be visually tiny

- be semi-transparent

- allow the invitation/card/ornament/text behind it to remain visible

- have a subtle border/glow/material treatment appropriate to THIS design

- continuously move the shop/brand name horizontally like a refined marquee

- never become a large opaque banner

- never cover or permanently hide important content

- remain usable on 360–430px mobile widths

- adapt gracefully on tablet/desktop

- be pointer-events-safe so it does not interfere with scrolling or normal content interaction




The brand name must come from the approved public invitation/shop-brand data contract associated with the invitation. The Shop Owner does NOT re-enter the brand name per invitation.




CRITICAL DATA RULE:

Do not query a shop table directly just to obtain the brand name. Do not invent a hardcoded brand name. The central public RPC contract must provide a safe public display field for the live invitation before the strip is wired to production. Keep the strip component data-driven and isolated so the field name can match the approved RPC contract. Do not modify central schema/RLS/RPC inside this design repo unless explicitly instructed as a separate central-platform task.




If the approved public payload field is named differently, use the actual approved field rather than inventing another backend field.




## 13. Construction principle




The defining creative principle of ZAR's new design family is:




THE DESIGN CONSTRUCTS ITSELF.




The visitor should feel that an artist, craftsperson, architect, weaver, jeweller, calligrapher, or other maker is physically building the invitation in real time.




This must be actual coded animation:

- SVG path drawing

- stroke-dasharray / stroke-dashoffset

- pathLength

- Motion orchestration

- transform/scale/position assembly

- opacity only as a supporting mechanism




Do NOT fake construction with a static illustration that simply fades in.




The construction language must be specific to THIS design concept. Do not borrow the construction mechanism from another concept.




## 14. Opening and scroll philosophy




The invitation should feel cinematic but remain an invitation, not an experimental website.




Use scroll progress intentionally:

- opening establishes the world

- construction begins at a deliberate moment

- sections reveal progressively

- ornamental construction can continue across the experience where specified

- transitions must preserve hierarchy and readability




Do not make every element move constantly.




Do not make text fight with the artwork.




Do not create giant background ornaments that make typography unreadable.




## 15. Responsive requirements




Design mobile-first for approximately 360–430px widths.




Then support tablet and desktop.




The mobile experience is the primary reference.




No horizontal overflow.




No clipped names.




No ornamental collision with text.




No layout that depends on a specific phone height.




## 16. Performance and implementation quality




Use reusable components for repeated primitives, but do not create an over-configured generic design engine.




Keep:

- content/data

- layout

- animation orchestration

- decorative SVG systems




reasonably separated.




Clean up animation listeners/observers.




Respect `prefers-reduced-motion`: reduce or simplify nonessential motion while preserving understandable state changes.




Do not add unnecessary dependencies.




## 17. Visual quality bar




The result must feel like a premium digital wedding invitation:

- deliberate spacing

- strong typography hierarchy

- controlled ornament density

- cinematic pacing

- tactile material illusion where appropriate

- elegant micro-interactions

- excellent mobile composition




Avoid:

- generic AI-generated landing-page appearance

- generic SaaS cards

- oversized headings

- excessive glassmorphism

- random gradients

- stock wedding-template appearance

- excessive particle effects

- visual clutter

- unrelated decorative motifs




## 18. Content safety against misconception




Use neutral development placeholder content ONLY for visual testing, and make it impossible for that placeholder to appear as a real invitation when RPC data is absent.




Never hardcode “Ahmed & Ayesha”, “14 Dec 2026”, or any other sample wedding as a production fallback.




The implementation must use real RPC data in live state.




## 19. Final acceptance test




Before considering the work complete, verify:

1. `/` does not show a random wedding.

2. `/:slug` loads exactly that slug.

3. Direct refresh of `/:slug` works on Vercel.

4. Invalid/malformed slug produces not-found.

5. RPC is the only invitation data source.

6. Live state never leaks another wedding.

7. Fallback contains no wedding-specific information.

8. Optional sections disappear cleanly.

9. Names remain readable on mobile.

10. RSVP is animation-only.

11. QR uses the exact returned public URL when used.

12. Directions appear only with a returned maps URL.

13. Contact buttons use only approved returned contacts.

14. No service-role key exists anywhere.

15. `.env.example` contains exactly the two allowed empty variables.

16. The brand ticker is tiny, transparent, floating, moving, and around the 70% viewport-height region rather than being a banner.

17. The ticker never uses a hardcoded shop name.

18. The design's construction animation is genuinely constructing the artwork rather than fading in a finished picture.

19. The construction mechanism is unique to this design concept.

20. No other ZAR design concept has been accidentally mixed into this design.





# 20. DESIGN-SPECIFIC CREATIVE CONTRACT




## Ribbon / Silk Formation




Core identity: flowing silk ribbons physically form the invitation's ornamental structure.




Construction mechanism:

- Start with a small number of elegant ribbon/silk paths entering from edges or from behind content.

- Ribbons curve, cross, weave, fold and settle into frames and section separators.

- Use SVG Bezier paths, transforms, motion and layered translucent material effects.

- The ribbon must visibly travel and settle into its final geometry; never use a finished ribbon image that merely fades in.

- Motion should feel soft, continuous and fabric-like.




Opening:

A calm fabric-like field with one subtle moving ribbon edge. After opening, the first ribbon begins its formation.




Hero:

Ribbons create a graceful frame around the couple names without crossing through the typography.




Section progression:

Opening → ribbon-built hero → date → message/family → events → venue → photos/gallery → RSVP → final silk composition.




Materials/palette:

Silk ivory, champagne, muted rose/dusty blush, warm gold accents or another restrained luxurious combination. Use translucency and soft highlights to suggest silk without becoming glossy plastic.




Non-negotiable:

The defining action is ribbon formation and settling. Do not turn it into filigree forging, textile weaving, architectural construction, botanical growth, or calligraphy.




## 21. Implementation instruction to Lovable




First understand the complete contract above. Then implement the design as a polished, functional Vite/React/TypeScript invitation frontend.




Do not ask to redesign the concept. Do not replace the concept with a generic wedding template.




Build the visual system, responsive layout, coded construction animation, content binding, lifecycle states, brand ticker, RSVP feedback animation, and optional sections exactly according to this document.




If an implementation detail is not specified, choose the smallest solution that preserves the stated design identity and the ZAR public integration contract. Do not invent new product features.




Do not modify central Supabase schema, RLS, lifecycle logic, or RPC behavior inside this design application.




At the end, perform a visual and functional pass specifically looking for:

- construction animation being genuinely visible and sequential

- text/art hierarchy

- mobile readability

- no accidental concept mixing

- no opaque brand banner

- no hardcoded shop/wedding data

- no broken optional sections

- no public data leakage

- no horizontal overflow

- no console errors
Visual reference only: Use this image to understand the intended visual direction and overall feel. Do not copy it literally or treat it as the functional specification. Follow the prompt as the source of truth, especially for the construction/animation and ZAR functionality.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b3d289ec-9ba2-44c1-b5aa-7a17d0e45675).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
