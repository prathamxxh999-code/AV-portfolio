# Ashish Verma portfolio

Open `index.html` in a browser. Keep `src/` and `assets/` beside it. This is a static site with no framework or install step.

## Site contents

- Personal portrait hero with project and CV links and a 3+ years experience figure.
- Multilingual intro and a drawing-process feature with text on the left and the supplied blueprint film on the right. `assets/blueprint-construction.mp4` is a web-ready version of the 4K file supplied by the user, with the audio omitted and no visual content added. `assets/blueprint-poster.jpg` is a frame from that film.
- Seven project studies with category filters and dedicated pages (`project.html?slug=...`).
- Project pages with overview, scope, role, concept, technical drawing, drawing/render comparison where available, challenge, and outcome.
- Full-screen drawing viewer with zoom, pan, touch pinch, reset, and keyboard controls; a rotatable schematic massing study on the Meridian page.
- Experience, tools, workflow, profile, vision, and contact sections.
- Downloadable portfolio and CV PDFs in `assets/`. The CV is linked in the hero and contact area; the portfolio PDF is linked on project pages.

## Source files

- `index.html` — homepage and project gallery.
- `project.html` — project page template.
- `src/styles.css` and `src/project.css` — styles and responsive layout.
- `src/main.js`, `src/boot.js`, `src/intro.js`, `src/plan-video.js` — homepage controls, intro, and video playback.
- `src/projects.js` — the seven project records.
- `src/project-page.js` — project rendering, drawing viewer, and 3D interaction.
- `assets/` — portrait, images, code-drawn SVG sheets, video, and PDFs.

## Editorial notes for the owner

The portfolio is a visual structure awaiting Ashish's confirmed details. Replace the current dates, roles, 3+ experience figure, education and certification copy, email, phone, LinkedIn, and CV contact details before using it as a factual public profile. The project images and stories are self-initiated design studies, not documentation of completed client commissions. Update `src/projects.js` and the PDFs when verified work arrives.

`assets/ashish-portrait.jpg` came from the supplied HTML. `assets/ashish-cutout.png` is an edited transparent-background version of that portrait.

## Generated design visuals

The concept images were created for this portfolio. The prompt directions were:

1. `hero-building.webp` — contemporary mid-rise residence at dusk with stepped concrete and glass volumes.
2. `villa-study.webp` — warm stone hillside villa with cantilevered terraces.
3. `pavilion-axon.webp` — exploded axonometric cultural pavilion assembly.
4. `residence-plan.webp` — top-down residential plan presentation.
5. `studio-interior.webp` — double-height creative studio interior.
6. `retail-atrium.png` — premium two-level retail atrium interior with warm daylight and precise architectural finishes.

The SVG technical sheets are code-drawn. The portrait cutout was made by removing the background from the supplied Ashish photo while retaining his appearance and pose.
