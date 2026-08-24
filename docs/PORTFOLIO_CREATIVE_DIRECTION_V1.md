# PORTFOLIO_CREATIVE_DIRECTION_V1

**Project:** Emir Duman — Creative Developer Portfolio  
**Document Type:** Master Creative Direction / Single Source of Truth  
**Version:** V1.0  
**Status:** **DESIGN FREEZE — APPROVED FOR IMPLEMENTATION**  
**Primary Experience:** Single-page, chapter-based creative portfolio  
**Secondary Experience:** Dedicated case-study routes for flagship projects  
**Last Updated:** 2026-08-24

---

## 0. DOCUMENT AUTHORITY

This document is the **single source of truth** for the V1 design, narrative, interaction, visual system, content hierarchy, motion grammar, responsive strategy, performance targets, and implementation boundaries of the portfolio.

Its purpose is to prevent the project from drifting into a collection of unrelated creative effects. Any new visual idea, interaction, component, shader, 3D object, or layout concept discovered after this freeze must satisfy one of the following:

1. It directly supports an already-defined section goal without replacing that section's primary interaction.
2. It replaces an existing idea because testing proves the existing idea is technically weak or visually unsuccessful.
3. It is moved to the **Backlog / V2** rather than added to V1.

### Change-control rule

A change is allowed during implementation if one of these conditions is true:

- usability testing shows that users do not understand an interaction;
- performance is below the agreed budget;
- a browser/device cannot reliably support the intended experience;
- a visual decision looks weaker in the real browser than in the design specification;
- content constraints require a layout adjustment.

A change is **not** justified simply because another interesting effect was discovered.

---

# 1. CREATIVE POSITIONING

## 1.1 Primary identity

The portfolio must position Emir as:

> **Creative Developer first. Product-minded engineer second.**

The site must communicate that its owner can design and build memorable digital experiences while retaining meaningful engineering depth and product judgment.

The intended perception is not:

> “A developer who also likes design.”

The intended perception is:

> **“A visual and product-minded creative developer who can actually engineer the experience he imagines.”**

## 1.2 Competence layers

### Primary layer — Creative Development

- interaction design;
- front-end experience engineering;
- WebGL / Three.js / React Three Fiber;
- shaders and custom visual effects;
- kinetic typography;
- motion systems;
- experimental interfaces.

### Secondary layer — Product Thinking

- understanding user behavior;
- feature reasoning;
- interface clarity;
- prioritization;
- trade-off thinking;
- product storytelling;
- decision rationale.

### Engineering credibility layer

- React / Next.js / TypeScript;
- .NET / C#;
- backend understanding;
- REST APIs;
- SQL;
- architectural reasoning;
- performance optimization.

### Visual craft layer

- Blender;
- Photoshop;
- Figma;
- typography;
- composition;
- visual direction;
- poster and asset creation.

### Personality layer

- curious;
- experimental;
- warm;
- playful;
- professional;
- culturally aware;
- interested in life beyond work.

## 1.3 What the portfolio must NOT become

The V1 site must not resemble:

- a generic front-end developer template;
- a dark SaaS landing page;
- a shadcn-style card collection;
- an AI-generated glassmorphism showcase;
- a neon cyberpunk theme;
- a component-library demonstration;
- a “look how many animations I found” portfolio;
- a skill-logo cloud;
- a fake operating-system clone;
- a theme built around one visual trick such as liquid, glow, or glass.

The site may contain liquid materials, glass, chrome, futuristic details, or Y2K references, but none of them may become the entire identity.

---

# 2. CORE CREATIVE IDEA

## 2.1 Working creative-direction name

> **Neo-Y2K Editorial Digital Studio**

This is an internal art-direction label, not necessarily user-facing copy.

The design should merge:

- editorial composition;
- Neo-Y2K cultural references;
- scrapbook tactility;
- custom 3D objects;
- modern skeuomorphic materials;
- restrained glass/translucency;
- physical interaction metaphors;
- personal photography;
- custom graphic artifacts.

The site should feel designed by a person with taste, not generated from a visual trend checklist.

## 2.2 Design mixture

| Language | Role |
|---|---|
| Neo-Y2K | Cultural / typographic attitude |
| Editorial scrapbook | Human, photographic, personal layer |
| 3D / WebGL | Technical signature and spatial depth |
| Modern skeuomorphism | Physical behavior and tactile materials |
| Glass / translucency | Small physical surfaces only |
| Claymorphism | Not a core style; may appear only in a single optional 3D prop |
| MacOS-style UI | Not part of V1 navigation |

---

# 3. MASTER DESIGN PRINCIPLES

## 3.1 One primary trick per scene

Every major section has one dominant interaction language.

| Section | Primary language |
|---|---|
| Hero | Pointer reveal |
| Manifesto | Typography |
| Selected Work | 3D stack |
| Playground | Physical objects |
| Signpost | 3D navigation |
| Off Screen | Photography journey |
| Capabilities | Editorial clarity |
| About | Scrapbook storytelling |
| Outro | Tactile tear + cinematic typography |

Secondary effects must support the primary interaction rather than compete with it.

## 3.2 Show, do not list

Do not merely state skills when they can be demonstrated.

Examples:

- do not just list **Blender** — use original Blender assets;
- do not just list **Photoshop** — create the poster, tickets, stickers, textures, and photo treatments;
- do not just list **WebGL** — present custom interactive graphics;
- do not just say **product thinking** — expose decisions and trade-offs inside case studies.

## 3.3 Controlled chaos

Freeform sections such as Playground and About must appear loose, imperfect, and authored while still sitting on an invisible design grid.

> **Hidden grid. Visible freedom.**

Random placement is not acceptable. Every apparent irregularity should be compositional.

## 3.4 Physical before artificial

Whenever possible, effects should use physical metaphors:

- scratch;
- peel;
- drag;
- swing;
- rotate;
- tear;
- press;
- settle;
- paper;
- aluminium;
- acrylic;
- glass;
- printed graphics.

This is preferred over arbitrary glow, floating cards, or decorative gradient movement.

## 3.5 Restraint creates premium quality

Not every object should move. Not every section should use WebGL. Not every surface should be glass. Not every headline should be animated.

The strongest moments gain value because other moments are allowed to remain still.

## 3.6 Authored, not generated

The site must contain visible evidence of authorship:

- custom stickers;
- custom poster;
- custom 3D models or modified models;
- custom photo treatment;
- specific copy;
- personal field notes;
- original interaction logic.

Avoid stock visual filler.

---

# 4. INFORMATION ARCHITECTURE

## 4.1 Primary route

```text
/
```

The homepage is one continuous, chapter-based cinematic portfolio.

Navigation does not divide the main story into separate About, Skills, or Contact pages.

## 4.2 Main chapters

```text
01 — HERO / IDENTITY
02 — MANIFESTO
03 — SELECTED WORK
04 — PLAYGROUND / LAB
05 — 3D INTERLUDE / SIGNPOST
06 — OFF SCREEN
07 — CAPABILITIES
08 — ABOUT
09 — CONTACT / OUTRO
```

## 4.3 Primary navigation

The persistent navigation uses:

```text
WORK
PLAY
ABOUT
CONTACT
```

These navigate to homepage sections.

Navigation must remain minimal and must not compete with the experience.

## 4.4 Case-study routes

Flagship work receives dedicated routes:

```text
/work/[slug]
```

Target V1 maximum: **4 case studies**.

A project must offer both:

- **CASE STUDY**
- **LIVE EXPERIENCE ↗**

Directly sending every visitor away from the portfolio is not acceptable.

## 4.5 Utility route

Custom 404 experience:

```text
/404
```

Direction:

- bad-TV / lost-signal atmosphere;
- PS1-inspired jitter as a possible effect;
- minimal copy;
- normal accessible return navigation.

Working copy direction:

```text
404
YOU WENT TOO FAR.
SIGNAL LOST.

RETURN TO REALITY
```

---

# 5. STORYTELLING MODEL

The homepage is not a stack of sections. It is a nine-act narrative.

| Act | Section | Question answered |
|---|---|---|
| 01 | Hero | Who is this? |
| 02 | Manifesto | How does he think? |
| 03 | Selected Work | Can he actually deliver? |
| 04 | Playground | What happens when there is no brief? |
| 05 | Signpost | Is this a designed world rather than a page? |
| 06 | Off Screen | Who is he away from the screen? |
| 07 | Capabilities | What can he professionally do? |
| 08 | About | How did these interests become one identity? |
| 09 | Outro | What happens next? |

## 5.1 Emotional curve

| Section | Energy | Target emotion |
|---|---:|---|
| Hero | 8/10 | Intrigue |
| Manifesto | 7/10 | Anticipation / identity |
| Selected Work | 8/10 | Confidence / proof |
| Playground | 10/10 | Play / curiosity / discovery |
| Signpost | 4/10 | Reset / surreal calm |
| Off Screen | 5/10 | Warmth / humanity |
| Capabilities | 3/10 | Clarity / professionalism |
| About | 6/10 | Intimacy / understanding |
| Outro | 9/10 | Finale / invitation |

The experience must not continuously increase in intensity. The deliberate energy drop after Playground is essential.

---

# 6. GLOBAL VISUAL SYSTEM

## 6.1 V1 colour palette

```css
--color-paper:     #F1EEE7;
--color-ink:       #171614;
--color-black:     #080808;
--color-graphite:  #1C1C1A;
--color-silver:    #B8BAB7;
--color-muted:     #89867F;
--color-accent:    #B85A2D;
```

### Roles

**Paper — `#F1EEE7`**  
Primary light editorial surface. It should feel warmer than digital white.

**Ink — `#171614`**  
Main dark typography on paper.

**Black — `#080808`**  
Cinematic darkness used for Hero and Playground.

**Graphite — `#1C1C1A`**  
Dark reset surface for Signpost and supporting dark environments.

**Silver — `#B8BAB7`**  
Reference tone for UI details and physical metallic language.

**Muted — `#89867F`**  
Secondary copy and metadata.

**Accent — `#B85A2D`**  
Oxide / burnt orange. Maximum approximate usage: **3–5% of visible UI**.

The site must never become an “orange theme”.

## 6.2 Forbidden colour behaviour

Do not use the following as the site identity:

- blue/purple neon gradients;
- cyan glows;
- pink AI gradients;
- full-screen aurora;
- rainbow glass borders;
- generic dark-mode purple lighting.

Other colours may appear naturally inside photography, posters, stickers, or project screenshots.

## 6.3 Section background map

| Section | Background |
|---|---|
| Hero | Near black |
| Manifesto | Near black → warm paper |
| Selected Work | Warm paper |
| Playground | Near black + subtle starlight |
| Signpost | Deep graphite / cinematic |
| Off Screen | Warm paper / photographic |
| Capabilities | Warm paper |
| About | Warm paper + collage |
| Outro | Dark |

The macro rhythm is:

```text
DARK
→ DARK / LIGHT TRANSITION
→ LIGHT
→ DARK
→ GRAPHITE
→ LIGHT
→ LIGHT
→ LIGHT
→ DARK
```

---

# 7. TYPOGRAPHY SYSTEM

## 7.1 Typeface roles

### Primary — Instrument Sans

Use for:

- body copy;
- navigation;
- interface labels;
- project descriptions;
- CTAs;
- general system text.

Usage:

- primarily 400–600;
- use width/stylistic variation sparingly;
- default body should remain highly readable.

### Editorial Display — Instrument Serif

Use for:

- manifesto statements;
- editorial section headings;
- selective oversized words;
- emotional/personal emphasis.

Instrument Serif is a display face. It must remain special.

### Technical — IBM Plex Mono

Use for:

- section numbering;
- dates;
- project metadata;
- lab IDs;
- technical labels;
- location/year captions where appropriate.

### Personal annotation

Do **not** use a generic handwritten web font as a major system font.

Handwritten/marker notes should preferably be:

- custom SVG;
- scanned handwritten text;
- Photoshop-made annotations;
- hand-built vector lettering.

This prevents the scrapbook layer from looking like a template.

## 7.2 Type scale — V1 defaults

Use fluid `clamp()` values in implementation.

| Role | Desktop range |
|---|---:|
| Micro / utility | 10–12 px |
| Metadata | 12–14 px |
| Body | 16–19 px |
| Lead | 24–34 px |
| Section heading | 64–96 px |
| Display | 110–180 px |
| Mega statement | 140–240 px, viewport-responsive |

Rules:

- Body line-length: approximately **60–65ch maximum**.
- Large typography may intentionally exceed viewport boundaries.
- Tiny mono labels are allowed but must remain readable.
- Do not animate long paragraphs aggressively.
- Serif should not replace body text.

---

# 8. GLOBAL LAYOUT SYSTEM

## 8.1 Grid

```text
Desktop: 12 columns
Tablet:   8 columns
Mobile:   4 columns
```

Default content max-width:

```text
1600px
```

Cinematic elements may intentionally break the container.

## 8.2 Global gutter

```text
Desktop: clamp(32px, 4vw, 64px)
Tablet:  28–40px
Mobile:  18–24px
```

## 8.3 Vertical rhythm

Approximate section padding:

```text
Desktop: 140–220px
Tablet:  110–160px
Mobile:   80–120px
```

Interactive scenes can use their own viewport-based height.

## 8.4 Freeform-layout rule

Playground and About may visually ignore conventional rows, but objects must still align to internal anchors derived from the grid.

No object should be placed only because an empty area exists.

---

# 9. MATERIAL & SURFACE LANGUAGE

## 9.1 Core materials

Use:

- warm uncoated paper;
- brushed aluminium;
- chrome/silver;
- acrylic;
- translucent plastic;
- subtle physical glass;
- printed stickers;
- holographic security foil;
- paper ticket stock;
- photographic surfaces.

## 9.2 Glass usage

Glassmorphism is allowed only where the object has a physical reason to be glass/translucent.

Good examples:

- acrylic keychain;
- display case;
- lab monitor surface;
- subtle translucent device component.

Avoid:

- every card having backdrop blur;
- giant glass panels;
- glowing glass dashboard UI.

## 9.3 Texture rules

Textures should add physicality rather than dirt.

Allowed:

- extremely subtle paper grain;
- micro scratches on metal;
- minor wear;
- printed imperfections;
- foil response;
- subtle scan texture.

Avoid excessive grunge.

---

# 10. MOTION GRAMMAR

## 10.1 Motion families

| Family | Default duration | Use |
|---|---:|---|
| Micro | 160–240 ms | cursor, button, tiny hover |
| UI | 280–450 ms | nav, labels, component state |
| Physical | 550–900 ms | sticker settle, keychain, object movement |
| Cinematic | 1.1–1.8 s | section transitions, major reveals |

Continuous motion such as marquees may be linear.

## 10.2 Easing defaults

```css
--ease-ui:        cubic-bezier(.22,.61,.36,1);
--ease-soft:      cubic-bezier(.16,1,.3,1);
--ease-cinematic: cubic-bezier(.76,0,.24,1);
```

Spring/overshoot behaviour is restricted to physical objects. Typography does not bounce.

## 10.3 Technology ownership

| Motion category | Technology |
|---|---|
| Smooth scrolling | Lenis |
| Scroll orchestration | GSAP + ScrollTrigger |
| DOM typography | GSAP + CSS |
| Basic hover | CSS |
| 3D | React Three Fiber / Three.js |
| Shader work | GLSL / Three.js |
| Physical 3D interaction | R3F |
| Scratch surface | 2D Canvas first |
| Heavy extra motion libraries | Not permitted in V1 |

Do not introduce Anime.js, Framer Motion, or another global animation engine unless implementation proves a specific need that GSAP/CSS cannot reasonably solve.

## 10.4 Text-motion grammar

### Short text

Can be expressive:

- Vertical Cut;
- Scroll Float;
- depth/scale transitions;
- custom stagger.

### Long text

Must be readable:

- Scroll Reveal;
- opacity/position;
- restrained word/line reveal.

### Utility labels

Can contain quick micro surprises:

- decrypted text;
- tiny counters;
- mono transitions.

Rule:

> **Short = expressive. Long = readable. Label = playful.**

---

# 11. CURSOR & POINTER SYSTEM

Desktop fine-pointer devices use one coherent custom cursor state system.

Suggested states:

```text
DEFAULT
DRAG
SCRATCH
PRESS
VIEW
ROTATE
```

Cursor labels must be small and quiet. The cursor must never become a large animated graphic.

On touch/coarse-pointer devices, custom cursor behaviour is disabled.

---

# 12. SECTION SPECIFICATIONS

## 12.1 01 — HERO / IDENTITY

### Purpose

Create immediate intrigue and establish that this is a custom creative-development experience rather than a conventional developer portfolio.

### Emotional goal

> “This is different.”

### Background

`--color-black`

### Main visual

The existing interactive portrait / material reveal system remains the Hero's signature interaction.

Do not replace it with a generic ready-made liquid background.

### Composition

Keep the scene sparse.

Primary elements:

- portrait;
- name;
- creative-developer identity;
- minimal navigation;
- tiny supporting location/status line if necessary.

### Working copy

```text
EMIR DUMAN
CREATIVE DEVELOPER
ISTANBUL / EARTH / MOSTLY ONLINE
```

This copy may be refined later without changing the design system.

Alternative personality line retained in content backlog:

> Designing things. Breaking some. Building better ones.

### Interaction

Primary:

- pointer reveal / material response.

Secondary:

- subtle material response only.

No second hero effect.

### Must not include

- skills;
- multiple CTAs;
- project cards;
- giant rotating text;
- another WebGL background;
- social icon wall.

### Exit choreography

The Hero does not simply scroll out.

1. navigation/UI becomes quieter;
2. portrait interaction settles;
3. scene darkens/recedes;
4. typography becomes dominant;
5. `02 / MANIFESTO` enters.

The visual satisfaction from Hero must continue into Manifesto.

### Mobile

Touch-driven simplified reveal.

### Reduced motion

Static/low-motion portrait with accessible content.

---

## 12.2 02 — MANIFESTO

### Purpose

Convert visual intrigue into a clear creative point of view.

The user should understand that Emir is interested not merely in building interfaces, but in designing how digital products feel.

### Background

Begins near black and eventually transitions into warm paper.

### Visual direction

No photography. This section is a typography-first cinematic experience.

### Chapter label

Use a small decrypted label once:

```text
02 / M_N_F_ST_
→
02 / MANIFESTO
```

Approximate effect duration: 0.6–0.9 s.

This is a micro surprise, not a Matrix scene.

### Core statements

Working V1 sequence:

```text
I DON'T JUST BUILD INTERFACES.

I BUILD THE FEELING AROUND THEM.
```

Then:

```text
DESIGN SHOULD MOVE.
CODE SHOULD HAVE PERSONALITY.
PRODUCTS SHOULD FEEL HUMAN.
```

Supporting paragraph direction:

> I move between design, development, 3D, product thinking and visual experimentation — mostly because choosing only one sounded boring.

Final wording may be polished later but the information architecture remains.

### Motion assignment

- first cinematic statements: Vertical Cut / depth-driven Scroll Float;
- short principles: expressive reveal;
- supporting paragraph: Scroll Reveal;
- no simultaneous competing animation on the same text.

### IMAX-inspired principle

Take inspiration from the scale, anticipation, and spatial pacing of large-format cinema intros.

Do **not** copy IMAX branding, countdown graphics, tunnel imagery, or typography.

Use only:

- controlled suspense;
- scale;
- negative space;
- sequential statements.

### Section exit

Use one restrained velocity-driven transition line:

```text
DESIGN × CODE × PRODUCT × 3D × PLAY ×
```

This is a punctuation device, not a persistent marquee.

---

## 12.3 03 — SELECTED WORK

### Purpose

Immediately prove the claims made by Hero and Manifesto.

The user should move from:

> “Interesting.”

to:

> “He actually makes things.”

### Background

Warm paper.

No animated background shader behind the project stack.

### Project count

**4 flagship projects maximum.**

No 10–12 project dump inside this section.

Additional experiments belong to Playground / future Archive.

### Primary interaction

Custom spacious **3D Stack Motion**.

The stack must be more spacious and editorial than a dense card deck.

Each project receives a clear moment as the main visual.

### Layout behaviour

Avoid a 2×2 portfolio grid.

Use a scroll-driven spatial exhibition.

Cards can rotate and translate in Z but must remain readable and stable.

### Homepage content per project

Display only:

- project number;
- title;
- year;
- role;
- one-line concept;
- selected technologies;
- Case Study CTA;
- Live Experience CTA.

### Project route transition

Clicking Case Study should visually feel like the selected project expands into a full-screen experience.

Technically it navigates to:

```text
/work/[slug]
```

This preserves shareable URLs, browser navigation, SEO, content freedom, and accessibility.

### Live CTA

Every appropriate project exposes:

```text
LIVE EXPERIENCE ↗
```

as a separate action.

### Case-study reading target

Approximately **3–5 minutes**, visually scannable.

No long Medium-style essay.

### 3D Device Showcase decision

Do not use the 3D laptop as the primary Selected Work navigator.

Reserve a laptop/device opening animation for an individual project case study where it has contextual meaning.

### Mobile

3D stack becomes a simplified vertical cinematic project sequence.

---

## 12.4 04 — PLAYGROUND / LAB

### Purpose

Answer:

> “What does Emir make when nobody gives him a brief?”

This is the highest-energy, most tactile, playful section.

### Working copy

```text
04 / PLAYGROUND

THINGS I MADE
WITHOUT BEING ASKED TO.

probably the most honest section on this site.
```

### Background

`--color-black`

Add tiny starlight points inspired by luxury starlight headliners.

Rules:

- dots, not star shapes;
- very low density;
- low opacity;
- subtle brightness variance;
- no galaxy;
- no constellation;
- no obvious space theme;
- no strong parallax.

### Approximate section height

Desktop starting target:

```text
~200svh
```

with a controlled sticky interaction stage.

Tablet may shorten. Mobile becomes a vertical artifact journey.

### Entrance

1. heading is initially dominant;
2. heading recedes;
3. objects enter gradually;
4. Can becomes unmistakable central focus.

Do not reveal everything at once.

### Central hero object — Brushed aluminium can

The can sits at the composition centre.

#### Form

Use a familiar soda-can form factor.

Do **not** use Coca-Cola branding or a branded Coca-Cola can.

#### Surface

- brushed aluminium;
- controlled roughness;
- subtle wear;
- physically believable highlights;
- no coloured drink-brand wrap.

#### Idle behaviour

- very slow subtle Y rotation;
- idle rotation stops when pointer enters the can interaction zone;
- can is fully stable while a sticker is dragged;
- user does not freely rotate the can in V1.

The primary interaction belongs to the stickers.

### Sticker system

Total final stickers:

```text
6
```

Initial can state:

```text
5 stickers
```

Sixth sticker is unlocked by the scratchable boarding pass.

Confirmed stickers include:

```text
EMIR INSIDE™
01/01
```

Remaining final artwork is a production-content task, not an open design-system decision.

Recommended families:

- identity;
- warning/inventory;
- travel/life;
- purely graphic mark.

#### Sticker behaviour

- pointer hover slightly lifts the sticker visually;
- cursor becomes `DRAG`;
- pointer down lifts it by a tiny physical amount;
- drag is constrained to the can surface;
- small rotational freedom;
- release uses a soft physical settle;
- stickers may overlap;
- stickers may not leave the can;
- state does not persist after page refresh in V1.

### Scratchable boarding pass — upper-left / back-mid layer

Base object is a physical paper boarding pass with a **small holographic security strip**, not a full holographic UI card.

The scratch area reveals:

```text
RARE STICKER UNLOCKED
```

After sufficient scratch completion:

```text
ADD TO CAN
```

appears or the sticker is introduced to the can through a short authored transition.

Interaction loop:

```text
DISCOVER
→ SCRATCH
→ UNLOCK
→ PLACE
→ CUSTOMIZE
```

This interaction links the boarding pass and can into one system.

### Retro mini terminal — upper-right

Replace the earlier laptop concept with a custom retro typing machine / compact terminal.

Features:

- tactile keys;
- smooth key-press animation;
- small display;
- playful text reactions;
- physical-object presentation.

Do not make it visually larger than the can.

Potential output tone:

```text
DESIGN
CODE
PLAY
MAKE
BREAK
REPEAT
```

Exact phrases may be refined later.

### Lab monitor — mid-right

Present a small physical lab display rather than a standard web card.

Visual:

- restrained green terminal text is allowed;
- take mood inspiration from terminal culture;
- do not create generic Matrix rain.

Content can include believable creative-dev states:

```text
LAB/003
FRAGMENT STUDY
UV DISTORTION
NOISE MAP
SHADER ACTIVE
RENDER STATUS
```

A small custom shader may run inside the display.

This is a supporting artifact, not a second dominant GPU showpiece.

### Poster — lower-left / back layer

Direction:

> **Experimental typographic exhibition poster**

Create in Photoshop.

Characteristics:

- editorial typography;
- Neo-Y2K influence;
- warm paper / black / silver system;
- small accent-colour usage;
- potentially fictional Emir Lab exhibition identity;
- slight paper texture;
- small physical rotation;
- may partially leave the viewport.

The poster is primarily visual and does not require a large interaction.

### Acrylic keychain — left foreground

Primary direction:

- custom acrylic keychain;
- translucent physical material;
- small custom mark, e.g. `ED`, `04`, or project symbol;
- pointer hover triggers subtle pendulum/swing physics;
- never cartoonish.

Backup only if asset production proves unnecessarily expensive:

- F1-inspired keychain;
- tattoo-machine charm;
- cyberpunk-style charm.

The acrylic concept remains first choice.

### Die-cast car — lower-right foreground

A custom die-cast concept car is preferred to direct Hot Wheels branding.

Place inside a small premium display case.

Details:

- custom decal;
- possible `04` / `EMIR LAB`;
- physical plastic/acrylic case;
- subtle hover response;
- no large gimmick.

This object becomes the transition baton into the Signpost section.

### Depth structure

#### BACK

- poster;
- boarding pass;
- large heading remnants.

#### MID

- can;
- retro terminal;
- lab monitor.

#### FRONT

- acrylic keychain;
- die-cast car;
- loose/interactive sticker details.

Use extremely restrained parallax.

### Cursor states

Relevant states:

```text
DRAG
SCRATCH
PRESS
VIEW
```

No text instructions in V1 unless user testing shows discoverability problems.

Instructional microcopy is a V2/usability-response option.

### Exit choreography

As Playground releases:

1. supporting objects disappear or recede;
2. starlight fades;
3. die-cast car remains;
4. car moves downward/forward with the scroll;
5. visual environment cleans up;
6. the car leads the eye toward Signpost.

The section must transform into the next chapter rather than simply ending.

### Mobile

Mobile is a redesigned sequence:

```text
CAN
→ SCRATCH PASS
→ POSTER
→ TERMINAL
→ COLLECTIBLES
```

- touch sticker movement;
- scratch is preserved;
- parallax reduced;
- hover-only physics becomes tap response;
- fewer simultaneously rendered props.

---

## 12.5 05 — 3D INTERLUDE / SIGNPOST

### Purpose

Reset the user's visual system after Playground and create a quiet world-building transition.

This section is deliberately cleaner.

### Emotional goal

> Surreal calm after controlled chaos.

### Background

Transition from `#080808` to approximately `#1C1C1A` with a subtle atmospheric gradient/haze.

All Playground starlight disappears.

### Scene

Use a clean, minimal 3D environment.

Recommended environment language:

- matte graphite infinite floor or non-literal ground;
- controlled atmospheric haze;
- generous negative space;
- single dominant signpost.

Do not build a full road scene.

### Main visual

Custom Blender signpost.

Signpost navigation:

```text
WORK
PLAYGROUND
OFF SCREEN
ABOUT
```

Do not include `TOP`.

### Interaction

- subtle pointer-based orientation;
- small board response on hover;
- clear interactive affordance;
- board selection scrolls/navigates to corresponding homepage section.

Navigation behaviour must have an accessible DOM equivalent even if the visual click occurs on 3D geometry.

### Car transition

The Playground die-cast car enters this section before the signpost is completely revealed.

The car may stop slightly before or beside the signpost.

The signpost should remain visually clean and not be obstructed.

### Exit

The `OFF SCREEN` direction naturally becomes the forward narrative path.

The user transitions from abstract digital world-building into personal photography.

### Mobile

Simplified 3D view or lightweight static/limited 3D representation.

All four destinations remain tap-accessible via real DOM links.

---

## 12.6 06 — OFF SCREEN

### Purpose

Humanise the portfolio.

Show that the person behind the projects has experiences, travels, observations, and visual curiosity outside professional work.

### Emotional goal

> Warm, slower, human.

### Working heading

```text
06 / OFF SCREEN
```

Optional supporting phrase:

```text
FIELD NOTES FROM ELSEWHERE
```

### Background

Warm paper with photography providing natural colour.

No dark futuristic UI treatment.

### Content

Curate approximately **8–12 strong photographs**.

Content may include:

- travel photography;
- personal photography;
- locations;
- small memories;
- everyday visual observations;
- spontaneous captions.

### Caption style

Avoid generic travel captions.

Preferred tone:

- specific;
- observant;
- lightly humorous;
- warm;
- concise.

Example structure:

```text
MONTENEGRO / 2025

Got lost.
Kept walking.
Probably worth it.
```

### Primary experience

V1 design direction:

> **3D Memory Spiral / spatial photography journey**

This is not a normal photo grid.

Images occupy a spatial sequence around or through the viewer's scroll path.

Prototype implementation may choose the most performant spatial technique, but the design must remain a **spatial photography journey**, not masonry.

### Motion

Slower than Playground.

Photos should feel observed rather than attacked by effects.

Use:

- controlled depth;
- gentle focus changes;
- selective caption reveal;
- restrained parallax.

### Field notes

Small notes may appear beside or attached to selected frames.

Use the personal annotation system sparingly.

### Mobile

A touch-friendly cinematic photo sequence that preserves emotional rhythm without requiring a complex desktop 3D tube.

### Reduced motion

Editorial stacked photographs with normal captions.

---

## 12.7 07 — CAPABILITIES

### Purpose

Give the visitor a clean professional answer to:

> “What can he actually do?”

This section comes after the visual proof and therefore does not need spectacle.

### Emotional goal

> Clarity and competence.

### Background

Warm paper.

### Layout

Desktop: four clear discipline groups.

```text
CREATE
DESIGN
BUILD
THINK
```

#### CREATE

- Creative Development
- Interaction Design
- Motion
- Shaders
- WebGL

#### DESIGN

- Visual Direction
- UI / UX
- Photoshop
- Typography
- Figma

#### BUILD

- React
- Next.js
- TypeScript
- .NET / C#
- REST
- SQL

#### THINK

- Product Thinking
- UX Reasoning
- Prototyping
- Feature Discovery
- Experimentation

### Visual treatment

Minimal editorial typography.

No:

- progress bars;
- percentage skills;
- icon clouds;
- floating technology logos;
- glowing skill cards;
- fake ratings.

### Motion

Only restrained entrances.

This is an intentional breathing space.

### Mobile

Groups become a well-paced vertical sequence.

---

## 12.8 08 — ABOUT

### Purpose

Explain how seemingly different interests became one coherent identity.

Capabilities explains **what** Emir can do. About explains **why this combination exists**.

### Background

Warm paper with layered collage.

### Narrative direction

The biography should connect:

```text
Computer Engineering
→ Software Development
→ Interest in interface feeling
→ Visual Design / Photoshop
→ 3D / Blender
→ Creative Development
→ Product Thinking
```

Avoid writing it like a CV timeline.

### Visual system

Use the strongest scrapbook language in the site:

- portraits;
- scans;
- small photographs;
- physical paper;
- torn edges;
- personal artifacts;
- subtle handwritten notes;
- tape/print cues where visually justified.

Do not overfill the collage.

### `CAN'T YOU READ?` interaction

Keep the planned text-disruption Easter egg here.

Behaviour:

1. About paragraph is readable by default.
2. Tiny `CAN'T YOU READ?` action invites play.
3. Text scatters/distorts in a controlled way.
4. CTA changes to a restore-state message.
5. User can restore the copy immediately.

The effect must never trap the reader or destroy accessibility.

### Mobile

Collage becomes a controlled vertical editorial composition.

No uncontrolled object overlap that damages readability.

---

## 12.9 09 — CONTACT / OUTRO

### Purpose

Resolve the story with a memorable invitation rather than a generic contact section.

### Background

Dark.

### Working primary copy

```text
SO...
MAKE SOMETHING?
```

Supporting copy:

```text
Product. Website. Weird WebGL thing.
I'm listening.
```

Contact options:

```text
EMAIL
LINKEDIN
GITHUB
```

### Primary tactile interaction — Tear ticket

Use a physical contact ticket / perforated tear interaction.

Do not reuse Playground's scratch gesture.

Interaction family:

```text
PLAYGROUND → SCRATCH
OUTRO     → TEAR
```

The user tears/pulls a perforated section to reveal contact links.

The tear must be optional: links need a normal accessible reveal alternative.

### Footer growth

The footer becomes a final frame.

Large typography can grow toward:

```text
EMIR
DUMAN.
```

or an equivalent name treatment.

### Easter egg

Keep:

```text
EMIR INSIDE™
```

small and secondary.

It is not a brand logo.

### Emotional goal

The site should feel like it reached a finale, not merely reached the bottom of a page.

---

# 13. CASE-STUDY DESIGN SYSTEM

## 13.1 Goal

Case studies provide product reasoning and engineering depth without losing the visual language of the homepage.

They should be calmer than the homepage.

Homepage:

> personality + spectacle.

Case study:

> clarity + thinking.

## 13.2 Recommended content architecture

```text
PROJECT HERO
CONTEXT
IDEA / DIRECTION
KEY DECISIONS
BUILD
TRADE-OFFS
OUTCOME
LIVE EXPERIENCE
```

Target scan time: **3–5 minutes**.

Use more visuals than prose.

## 13.3 Case-study project hero

Include:

- project title;
- year;
- role;
- discipline;
- technologies;
- one-line project concept;
- hero visual;
- `VIEW LIVE ↗`.

Project-specific 3D device showcase may be used here where it supports the project.

## 13.4 Product-thinking requirement

At least one case-study block must expose:

- why a decision was made;
- a relevant constraint;
- a trade-off;
- an alternative considered;
- what changed as a result.

This is required to support the Product-minded positioning.

---

# 14. COPY & VOICE SYSTEM

## 14.1 Voice

The site voice is:

- professional;
- concise;
- intelligent;
- lightly mischievous;
- observant;
- personal without oversharing.

It must not sound like corporate marketing. It must not sound like an AI portfolio generator.

## 14.2 Preferred language patterns

Good:

> probably the most honest section on this site.

> Things I made without being asked to.

> Designing things. Breaking some. Building better ones.

> Product. Website. Weird WebGL thing. I'm listening.

Avoid:

> Transforming ideas into stunning digital experiences.

> Passionate developer crafting innovative solutions.

> Where creativity meets technology.

> Building the future one pixel at a time.

These are considered generic and prohibited unless intentionally parodied.

---

# 15. RESPONSIVE STRATEGY

## 15.1 Principle

> **Mobile is not desktop scaled down.**

Each scene receives a mobile choreography that preserves its purpose while reducing spatial complexity.

## 15.2 Section behaviour matrix

| Section | Desktop | Mobile |
|---|---|---|
| Hero | Full pointer reveal | Touch-controlled simplified reveal |
| Manifesto | Cinematic spatial typography | Simpler scroll typography |
| Selected Work | 3D stack | Vertical cinematic project cards |
| Playground | Freeform physical still-life | Ordered artifact journey |
| Signpost | Interactive 3D | Simplified 3D / tap navigation |
| Off Screen | Spatial photo journey | Touch-friendly photo sequence |
| Capabilities | Four-column editorial | Vertical discipline groups |
| About | Layered collage | Controlled vertical collage |
| Outro | Tear + giant footer | Touch tear / normal reveal fallback |

## 15.3 Pointer behaviour

Fine pointer:

- custom cursor states;
- hover;
- pointer-driven 3D response.

Coarse pointer:

- no custom cursor;
- tap/drag interactions;
- hover-only information prohibited.

---

# 16. ACCESSIBILITY

Creative execution must not require inaccessible interaction.

Required principles:

- semantic headings;
- meaningful DOM links;
- keyboard-accessible navigation;
- 3D signpost has DOM navigation equivalent;
- no information available only on hover;
- visible focus states;
- adequate contrast;
- reduced-motion path;
- scratch interaction has reveal alternative;
- tear interaction has contact reveal alternative;
- case-study routes work as normal pages;
- canvas content that contains essential information must have DOM equivalents.

---

# 17. REDUCED-MOTION STRATEGY

For `prefers-reduced-motion`:

- continuous 3D idle rotation stops;
- long parallax is removed;
- cinematic scrub animations become short fades/transitions;
- project stack becomes stable editorial sequence;
- Playground retains direct interaction but removes decorative movement;
- Signpost becomes a stable/lightweight scene;
- Off Screen becomes an editorial photo sequence;
- text destruction can be disabled;
- contact tear becomes a simple reveal action if needed.

Reduced motion is not a blank or visually inferior site.

---

# 18. PERFORMANCE BUDGET

## 18.1 Primary rule

> **Only one dominant GPU experience may be active at a time.**

Hero must not render at full intensity while Playground is active.

Playground must not run heavily while Off Screen is active.

Offscreen 3D scenes must be paused, throttled, unmounted, or rendered only on demand.

## 18.2 V1 targets

| Area | Target |
|---|---|
| Simultaneous dominant WebGL scenes | 1 |
| Desktop DPR | max ~1.5 |
| Mobile DPR | ~1.0–1.25 |
| Primary texture resolution | ≤ 2K |
| Secondary texture resolution | ≤ 1K |
| CLS | < 0.1 |
| INP | < 200 ms target |
| LCP | < 2.5 s where realistically possible |
| Post-processing | Minimal |
| Decorative DOM-particle systems | Avoid |

## 18.3 Asset optimization

Use as appropriate:

- GLB;
- Draco/Meshopt;
- compressed textures;
- KTX2 where worthwhile;
- WebP/AVIF for imagery;
- lazy loading;
- dynamic imports;
- visibility-aware render loops.

## 18.4 Playground performance priorities

### High-value / heavier

1. Can
2. sticker system
3. scratch interaction

### Medium

4. terminal
5. poster
6. car/display case

### Light

7. keychain
8. starlight
9. cursor states

If performance degrades, decorative props are simplified before core interaction is removed.

---

# 19. TECHNICAL RISK REGISTER

| Feature | Risk | Primary fallback |
|---|---|---|
| Draggable stickers constrained to 3D cylinder | HIGH | constrained decal/anchor system |
| Scratch → unlock → can state | MEDIUM | click/tap reveal fallback |
| 3D Stack Motion | HIGH | vertical GSAP project sequence |
| Spatial photo gallery | HIGH | choreographed DOM/GSAP gallery |
| Multiple R3F lifecycle management | HIGH | aggressive lazy mount/unmount |
| Signpost navigation | MEDIUM | static/light 3D + DOM links |
| Playground composition | MEDIUM | reduce supporting props |
| Tear gesture | MEDIUM | click/tap contact reveal |
| Hero legacy WebGL integration | MEDIUM | preserve stable existing hero and isolate portfolio additions |

High-risk interactions must be prototyped in isolated lab routes before being relied on by the full homepage.

---

# 20. ASSET PRODUCTION INVENTORY

## 20.1 Blender / 3D

### MUST

- Playground brushed-aluminium can
- 3D signpost
- acrylic keychain
- die-cast concept car + display case

### SHOULD

- retro mini terminal
- lab-monitor shell

### NICE TO HAVE

- additional chrome collectible
- project-specific device asset

## 20.2 Photoshop / Graphic Design

### MUST

- six Playground sticker artworks
- scratchable boarding pass
- Playground exhibition poster
- relevant paper/foil textures
- About collage assets
- selected photo treatments

### LATER

- case-study graphics
- additional posters
- extra lab graphics

## 20.3 Photography

Off Screen:

```text
8–12 selected photographs
```

About:

```text
3–5 portraits / scans / personal artifacts
```

Curation is preferred over volume.

---

# 21. INTERACTION INVENTORY

```text
HERO
- pointer portrait reveal

MANIFESTO
- scroll typography
- decrypted label
- velocity exit line

SELECTED WORK
- 3D stack
- project selection
- seamless case-study transition

PLAYGROUND
- sticker drag
- scratch boarding pass
- rare-sticker unlock
- terminal key input
- keychain physics
- lab-monitor output
- subtle car reaction
- context cursor

SIGNPOST
- subtle 3D response
- board navigation

OFF SCREEN
- spatial photography navigation
- field-note reveal

CAPABILITIES
- restrained editorial entrance

ABOUT
- scrapbook progression
- CAN'T YOU READ? text disruption

OUTRO
- tear interaction
- contact reveal
- growing final typography
```

Any additional major V1 interaction requires explicit justification.

---

# 22. V1 OUT OF SCOPE

The following are explicitly **not part of V1**:

- sound system;
- background music;
- MacOS Dock navigation;
- CMS;
- blog;
- authentication;
- user accounts;
- theme switcher;
- AI chatbot;
- persistent Playground customization;
- backend storage for sticker placement;
- full rigid-body Playground;
- full 3D navigable world;
- 10–12 featured projects;
- dozens of Lab experiments;
- shaders in every section;
- global cinematic transitions on every route;
- dark/light theme toggle;
- large hidden-route ecosystem.

New ideas are stored in the Backlog until V1 is complete.

---

# 23. REFERENCE SHORTLIST

The inspiration archive remains a research source. V1 does not copy these components directly; each reference has a specific role.

## Typography

- ReactBits Curved Loop  
  https://reactbits.dev/text-animations/curved-loop
- ReactBits Decrypted Text  
  https://reactbits.dev/text-animations/decrypted-text
- ReactBits Scroll Float  
  https://reactbits.dev/text-animations/scroll-float
- ReactBits Scroll Reveal  
  https://reactbits.dev/text-animations/scroll-reveal
- ReactBits Scroll Velocity  
  https://reactbits.dev/text-animations/scroll-velocity
- 21st.dev Vertical Cut Reveal  
  https://21st.dev/@danielpetho/components/vertical-cut-reveal
- Codrops Kinetic Typography  
  https://tympanus.net/Tutorials/codrops-kinetic-typo/

## Work presentation

- Codrops 3D Stack Motion  
  https://tympanus.net/Development/3DStackMotion/
- Codrops Device Showcase  
  https://tympanus.net/Tutorials/DeviceShowcase/

## Playground / tactile interaction

- Iskra Graphics  
  https://iskra.graphics/
- ReactBits Sticker Peel  
  https://reactbits.dev/animations/sticker-peel
- Vengence UI Typing Keyboard  
  https://www.vengenceui.com/components/typing-keyboard
- Brik generative sticker reference  
  https://brik.space/toolviewer?slug=remix-of-generative-ibile-sticker-mqvjbgdr

## Photography

- Codrops 3D Image Tube R3F  
  https://tympanus.net/Tutorials/3DImageTubeR3F/
- Brik spiral gallery reference  
  https://brik.space/toolviewer?slug=remix-of-spiral-gallery-mo08jp4x
- Brik choreographed gallery  
  https://brik.space/toolviewer?slug=choreographed-grid-gallery-ms2ycukb

## 3D / materials

- Codrops Transmission Material  
  https://tympanus.net/Tutorials/TransmissionMaterial/
- Aurelia  
  https://holtsetio.com/lab/aurelia/
- Three.js wavy cubes  
  https://projects.arkon.digital/threejs/wavy-cubes/

## 404 / error atmosphere

- Codrops PS1 Jitter Shader  
  https://tympanus.net/Tutorials/ps1-jitter-shader/
- Brik Bad TV  
  https://brik.space/toolviewer?slug=bad-tv-mo44uyx1

## Portfolio / composition references

- Pacôme Pertant  
  https://pacomepertant.com/
- Hirotos  
  https://www.hirotos.com/
- Aarab  
  https://aarab.vercel.app/

References are mood and behaviour sources, not component shopping lists.

---

# 24. FONT SOURCE / LICENCE NOTE

Selected V1 font families:

- Instrument Sans — SIL Open Font License 1.1  
  https://github.com/Instrument/instrument-sans
- Instrument Serif — SIL Open Font License 1.1  
  https://github.com/Instrument/instrument-serif
- IBM Plex Mono — open-source IBM Plex family under OFL  
  https://github.com/IBM/plex

Do not distribute font files as project deliverables outside the normal project dependency/hosting workflow.

---

# 25. IMPLEMENTATION PHILOSOPHY

The project should be built as **one repository with isolated development labs**, not as many unrelated repositories later stitched together.

Recommended pattern:

```text
src/
├── app/
│   ├── page.tsx
│   ├── work/
│   └── __lab/
│       ├── playground-can/
│       ├── sticker-system/
│       ├── scratch/
│       ├── work-stack/
│       ├── memory/
│       └── signpost/
│
├── components/
│   ├── hero/
│   ├── manifesto/
│   ├── work/
│   ├── playground/
│   ├── signpost/
│   ├── off-screen/
│   ├── capabilities/
│   ├── about/
│   └── outro/
│
└── lib/
    ├── motion/
    ├── three/
    ├── shaders/
    └── performance/
```

The exact filesystem may evolve, but isolation is mandatory.

---

# 26. CODEX TASK-SCOPING RULE

Every major implementation task given to Codex should define:

```text
TASK
ALLOWED FILES
DO NOT MODIFY
GOAL
OUT OF SCOPE
ACCEPTANCE CRITERIA
```

Example:

```text
TASK
Implement brushed aluminium Playground Can material.

ALLOWED FILES
src/components/playground/can/**
src/lib/playground-config.ts

DO NOT MODIFY
Hero
Manifesto
Global page layout
Package versions

GOAL
Render the production-intent can material.

OUT OF SCOPE
Sticker drag
Scratch
Scroll choreography

ACCEPTANCE CRITERIA
- Renders without console errors
- Responsive
- Stable frame rate
- Uses project quality controls
- Does not affect other sections
```

Codex should solve one technical problem at a time.

---

# 27. DEVELOPMENT PHASE HANDOFF

After this Creative Direction V1 freeze, the recommended project phases are:

## PHASE 1 — Technical Foundation

- portfolio development branch;
- design tokens;
- font integration;
- GSAP/Lenis architecture;
- Three/R3F quality/lifecycle architecture;
- responsive scaffolding;
- nine-section placeholder homepage.

## PHASE 2 — Interaction Labs

Prototype the risky parts before full section production:

```text
/__lab/playground-can
/__lab/sticker-system
/__lab/scratch
/__lab/work-stack
/__lab/memory
/__lab/signpost
```

## PHASE 3 — Section Production

Build:

```text
01 Hero
02 Manifesto
03 Selected Work
04 Playground
05 Signpost
06 Off Screen
07 Capabilities
08 About
09 Outro
```

## PHASE 4 — Case Studies

Create reusable case-study system and 3–4 flagship routes.

## PHASE 5 — Choreography

Connect individual sections into a single narrative:

- cross-section transitions;
- background transitions;
- timing;
- scroll rhythm;
- scene lifecycle.

## PHASE 6 — Production Polish

- mobile;
- accessibility;
- SEO;
- reduced motion;
- browser tests;
- GPU optimization;
- image/model optimization;
- Lighthouse and Core Web Vitals;
- final copy.

---

# 28. V1 DEFINITION OF DONE

Creative Direction V1 is considered correctly implemented when:

## Identity

- the site reads as a Creative Developer portfolio before it reads as a generic developer portfolio;
- product and engineering credibility remain visible;
- visual craft is demonstrated through actual work.

## Story

- the nine chapters are understandable;
- energy changes are deliberate;
- Playground is the peak;
- Signpost resets the viewer;
- Off Screen humanises the experience;
- Outro feels like a finale.

## Visual system

- warm paper / near-black / silver system is consistent;
- no AI-gradient identity emerges;
- typography roles remain disciplined;
- scrapbook sections feel authored;
- glass remains physically justified.

## Motion

- each scene has one dominant motion language;
- transitions feel continuous rather than section-by-section;
- no animation overload;
- long text remains readable.

## Interaction

- all critical actions are discoverable through testing;
- tactile interactions feel physical;
- essential information is not locked inside canvas-only experiences.

## Work

- four flagship projects maximum;
- Case Study + Live Experience model works;
- case studies demonstrate decisions and trade-offs.

## Performance

- only one dominant GPU scene is active;
- mobile experience is intentionally simplified;
- no desktop-only interaction blocks content;
- heavy assets are lazy loaded.

## Accessibility

- keyboard and touch paths exist;
- reduced-motion path exists;
- normal links exist for essential navigation/actions.

---

# 29. FINAL CREATIVE NORTH STAR

If a new design or engineering decision is unclear, judge it against this statement:

> **The portfolio should feel like stepping into a personal digital studio created by someone who thinks visually, understands products, and can engineer his own ideas. It should be playful without becoming childish, technical without becoming sterile, cinematic without becoming exhausting, and personal without becoming a social-media feed.**

The desired visitor reaction is:

> **“This guy knows design.”**

then:

> **“Wait — he built this?”**

then:

> **“He understands products and engineering too.”**

and finally:

> **“I remember him.”**

---

**END — PORTFOLIO_CREATIVE_DIRECTION_V1**
