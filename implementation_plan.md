# Implementation Plan: 3D Interactive Portfolio Website

We will build a state-of-the-art, premium developer portfolio and interactive resume for **Kunal** (Founder of OmniProcure & VibeSafe, TinyFish Accelerator Phase 2 cohort member). 

The website will feature a **3D 360-degree rotating card/model deck** against a clean white-grey backdrop with soft drop shadows. It will use advanced CSS 3D transforms and GSAP to deliver physics-based dragging, inertia, cursor-reactive parallax depths, and 3D popping animations, making every scroll, drag, and click feel distinct and tactile.

## Design Concept & Aesthetics

1. **Background & Atmosphere**:
   - Clean white-to-light-grey radial gradient with a subtle diagonal dot pattern (mimicking the TinyFish cohort badge styling).
   - Soft, dynamic drop shadows that move relative to the user's cursor to create realistic depth.
   - A modern typography hierarchy using **Outfit** (for headings, tech-forward feel) and **Inter** (for body text, clean readability).

2. **Core 3D Carousel (360° Rotating Hub)**:
   - A central 3D cylinder/carousel of "Resume Cards" that users can drag to rotate 360 degrees.
   - Each card represents a key facet of Kunal's career:
     - **Card 1: OmniProcure** (AI Procurement Platform, TinyFish Accelerator)
     - **Card 2: VibeSafe** (AI Security Tooling, "Vibe Coding" segment)
     - **Card 3: Open Source & PRs** (Tracer-Cloud/opensre - 6.3k stars)
     - **Card 4: Technical Projects** (BGE-M3 Search Reranker & Context Memory Worker)
     - **Card 5: Accelerator & Recognition** (TinyFish Phase 2 Announcement Badge & Logos)
     - **Card 6: Skills, Tools & Education** (Interactions showcasing the tech stack and Alard College)
   - Cards will have **3D layers** (`transform-style: preserve-3d`). Elements like logos, titles, and highlight tags will float above the card background at varying depths (`transform: translateZ()`), creating a holographic parallax effect as the card tilts.

3. **Magical Interactions ("Every Touch Feels Magical")**:
   - **3D Tilt on Hover**: Individual cards tilt slightly towards the cursor on hover.
   - **Click to Pop/Inspect**: Clicking a card will smoothly transition it out of the 3D rotating deck, scaling it up and "popping" it out of the screen. A detailed overlay expands with rich interactive tabs, source code links, metrics, and live action triggers.
   - **Physics-Based Drag**: Smooth inertia dragging for the 3D cylinder. Swiping or dragging decelerates naturally with drag friction.
   - **3D Badge Showcase**: A detailed interactive replica of the "TinyFish Accelerator - I Got Into Phase 2" badge, with a particle burst when unlocked or hovered.

---

## Proposed Changes

We will create a new project in the scratch folder.

**Project Path**: `C:/Users/kunal/.gemini/antigravity/scratch/portfolio`

### Files to Create

#### [NEW] [index.html](file:///C:/Users/kunal/.gemini/antigravity/scratch/portfolio/index.html)
- Main HTML structure.
- Loading screens with a futuristic boot-up animation.
- Central 3D scene viewport.
- Overlay details panels, contact/social floating dock, and interactive widgets.
- CDNs: GSAP (for spring physics and timelines), Lucide Icons, Canvas Confetti.

#### [NEW] [style.css](file:///C:/Users/kunal/.gemini/antigravity/scratch/portfolio/style.css)
- Core design tokens (light white/grey themes with metallic and glassmorphism finishes, dark-slate modes).
- CSS 3D setup: `perspective`, `transform-style: preserve-3d`, depth-based layers (`translateZ`).
- Smooth micro-animations (glowing pulses, gradient borders, shadow maps).
- Responsive grid layouts for details overlays and cards.

#### [NEW] [app.js](file:///C:/Users/kunal/.gemini/antigravity/scratch/portfolio/app.js)
- Core logic for 3D carousel physics: drag listener, inertia, touch-swipe translation, scroll-wheel rotation.
- Cursor parallax effect (calculating cursor coordinate offsets and applying subtle transforms to translateZ-layered elements).
- Card expansion animations (pop-out transition timeline using GSAP).
- Interactive details tabs (e.g. switching between "The Problem", "The Solution", and "Metrics" inside OmniProcure).
- Interactive skill grid with floating hover badges.
- Sound effect simulation or subtle audio-visual feedback (using synthesized browser Web Audio API for a soft mechanical clicking/sliding noise, toggleable).

---

## Verification Plan

### Automated Verification
- Run a local static server to host the project (`npx serve` or python `http.server`).
- Check browser console logs for any syntax or script loading errors.
- Ensure all resources (Google Fonts, Lucide icons, GSAP libraries) load successfully.

### Manual Verification
- **3D Rotation**: Verify the central deck rotates smoothly with a drag gesture, decelerates naturally, and snaps to the nearest card on release.
- **Popping Animations**: Verify clicking a card triggers a smooth scale-up transition and opens the detailed modal without layout breaking.
- **Responsive Layout**: Test on simulated mobile, tablet, and desktop viewports in the browser to ensure the 3D deck scales appropriately.
- **Tactile Feel**: Test scroll wheel zoom and click-slide controls. Check the particle effects on key actions.
