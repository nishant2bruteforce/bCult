# bCult | Redefine Your Silhouette

**bCult** is a conceptual digital experience for a high-end men's styling house. This project demonstrates a unique **"Manga/Sketch" aesthetic**, utilizing a high-contrast monochrome design, hand-drawn SVG animations, and a "messy desk" atmosphere to convey creativity and precision.

> "Style isn't just clothes. It's armor. It's a language."

![Project Status](https://img.shields.io/badge/Status-Complete-black?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-black?style=for-the-badge)

## 🎨 Design Philosophy

The visual identity is inspired by the chaotic workspace of a fashion designer or mangaka.
* **Aesthetic:** Ink-on-paper, monochrome, screentone textures.
* **Micro-interactions:** Buttons that jitter like sketches, SVG lines that "draw" themselves on load, and page-flip transitions.
* **Atmosphere:** Parallax mouse movement on the hero section simulates depth on a cluttered desk.

## 🌟 Key Features

### Visual & UI
* **No Frameworks:** Built entirely with Vanilla HTML, CSS, and JavaScript. No build tools required.
* **SVG Animations:** Line-art self-drawing animations on load.
* **Parallax Hero:** Interactive "Messy Desk" illustration that reacts to mouse movement.
* **Theme Toggle:** Switch between "Paper Mode" (Light) and "Midnight Ink" (Dark).

### Functionality
* **Smart Persistence:** * Dark/Light mode preference saved in `localStorage`.
    * **Contact Form Drafts:** Typing in the contact form saves your progress automatically. If you refresh, your message is still there.
* **Client-Side Search:** Filter the Collections page by category (Formal, Street, Grooming) or search text instantly.
* **SPA-Like Transitions:** Smooth page-flip animations between HTML files without using a router.
* **Accessibility:** Fully keyboard navigable, semantic HTML, and respects `prefers-reduced-motion`.

## 📂 File Structure

The project consists of exactly **6 files**. No external assets (images) are required as all graphics are generated via CSS or inline SVG.

```text
bCult_Website/
├── index.html       # Home / Hero / Feature Showcase
├── projects.html    # Collections Grid with Search & Filtering
├── about.html       # Timeline & Brand Origins (Comic layout)
├── contact.html     # Form with Validation & Draft Saving
├── style.css        # Global Styles, Sketch Borders, Animations
└── script.js        # Logic for interactions, modal, storage, etc.
