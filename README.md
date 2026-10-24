# SUGAR FIT™ | 3D Interactive Ayurvedic Landing Page

> **Product:** SUGAR FIT - Diabetes Control & Body Detox Wooden Tumbler (*Vijaysar / Pterocarpus Marsupium*)

A modern, high-converting, interactive 3D landing page built with **Three.js**, **GSAP ScrollTrigger**, and **Tailwind CSS**, featuring authentic product photography, live demonstration video, official campaign posters, and the printed Ayurvedic Hindi instruction manual.

---

## 🌟 Key Features

### 1. Brand & Aesthetic Direction
- **Color Palette:**
  - Deep Herbal Forest Green (`#1B4332`)
  - Warm Teak/Wood Brown (`#8B5A2B`)
  - Warm Sunlight Cream (`#FBF8F1`)
  - Golden Herbal Amber (`#D4A373`)
- **Typography:** Refined serif headers (*Cinzel*, *Playfair Display*) paired with geometric sans-serif (*Plus Jakarta Sans*) and Devanagari (*Noto Sans Devanagari*).

### 2. Live Video Demonstration & Unboxing
- **Embedded Video Player:** Features the official demonstration video ([`videos/sugarfit-demo.mp4`](file:///c:/Users/hp/OneDrive/Desktop/website%20skill/sugerfit/videos/sugarfit-demo.mp4)) showcasing the real handcrafted Vijaysar tumbler, authentic lid/coaster, and the overnight water cold infusion ritual.
- **Interactive Video Lightbox Modal:** 1-tap "Watch Video Demo" button in the hero section and navigation bar that launches full-screen video playback with direct WhatsApp checkout.
- **On-Page Theater Showcase:** Placed right below the photo gallery with trust badges and immediate order buttons.

### 3. Interactive 3D Model & Scroll-Driven Canvas ([`main.js`](file:///c:/Users/hp/OneDrive/Desktop/website%20skill/sugerfit/main.js))
- **Hero 3D Lathe Model:** Handcrafted Vijaysar tumbler matching the official studio product photos with flared foot base, turned ring grooves, and inner water cavity.
- **Official Decal Badge:** Features the authentic label on both the wooden tumbler front and matching coaster:
  > *"DIABETES CONTROL GLASS - SUGAR FIT - मधुमेह नियंत्रित गिलास - 100% NATURAL"* with green tree emblem.
- **Procedural PBR Textures:** Natural raw Vijaysar heartwood grain, end-grain concentric tree rings, porous wood fibers, and normal/bump map (0% varnish / unpolished).
- **4-Stage Scroll-Driven Storyline:**
  1. **Stage 1 (Hero):** Tumbler floats upright with soft natural light reflection and an anti-gravity floating coaster.
  2. **Stage 2 (Water Activation):** Coaster lifts off and shifts aside; clean water particle droplets pour into the tumbler.
  3. **Stage 3 (Hima Kalpana Cold Infusion):** Night-to-day background transition; liquid gradually deepens into clear herbal amber-brown (`#b8631c`) with glowing botanical diffusion particles.
  4. **Stage 4 (Morning Pour & Detail):** Tumbler completes a 360° rotation to showcase wood grain and base, then tilts to pour fresh infused amber water into an adjacent clear glass.
- **3D Inspect Mode:** Interactive button to rotate, zoom, and inspect the wood grain in full 360° via OrbitControls.
- **Web Audio Ripple Sound:** Soothing water trickle sound effect synthesized via Web Audio API.

### 4. Integrated Real Photography & Official Leaflets
- **Studio Photography:** Handcrafted Vijaysar tumbler & matching seal coaster on woven jute mat (`images/product-studio-shot.png`).
- **Official Campaign Poster:** "Small Change... Better Health! Natural Sugar, A Healthier You" (`images/hero-poster.jpg`).
- **Official Product Flyer:** ₹699 Special Offer + Free Coaster Included (`images/product-pamphlet.jpg`).
- **Authentic Hindi Instruction Leaflet:** Printed user guide and care sheet (`images/hindi-instructions-guide.jpg`).
- **Interactive Lightbox Modal:** Click any photo to inspect high-resolution details with direct WhatsApp order links.

### 5. Authentic Hindi Ayurvedic Guide ("लकड़ी का गिलास - हिम कल्पना विधि")
- **10 Traditional Ayurvedic Benefits in Hindi:** Transcribed directly from the official printed leaflet.
- **इस्तेमाल करने का सही तरीका:** 6-8 घंटे रातभर भिगोने की विधि, सुबह खाली पेट सेवन, बिना साबुन साफ पानी से धोने के निर्देश।
- **प्राकृतिक लकड़ी की पहचान (Seepage Notice):** पसीना आना या हल्का लीक होना 100% केमिकल-फ्री लकड़ी की पहचान है; मिट्टी के घड़े या कांच के बर्तन में रखने का उपाय।
- **कारीगर व किसान प्रोत्साहन:** 5-स्टार रेटिंग देकर ग्रामीण कारीगरों का समर्थन।

### 6. High-Converting E-Commerce & WhatsApp Integration
- **Hero Pricing Card:** Regular ₹1,399 (struck through) ➔ Special Offer ₹699 (50% OFF, Free Coaster Included).
- **Core Health Benefits:** 4 glassmorphism cards (Blood Sugar Regulation, Digestion & Metabolism, Natural Body Detox, Weight & Vitality).
- **Direct WhatsApp Touchpoints:**
  - Order Line (+91 7017905125)
  - Inquiries / Support (+91 9358190766)
  - Pulsating green floating WhatsApp button (bottom-right).
  - Sticky bottom "Quick Buy" bar on mobile devices.
  - Interactive Custom Order Modal with dynamic pack pricing (1 Pc ₹699, Couple Pack 2 Pcs ₹1,299, Family Pack 4 Pcs ₹2,399).

### 7. Official Brand & Head Office Verification
- **Marketed By:** ZS NATURAL
- **Head Office Address:** Head office. ELITE ASHIYANA, DOOR NO. 4/1 RAYYAPA ROAD FRAZAR TOWN BANGLORE. 560005
- **Official Email:** zsayurvedaa@gmail.com
- **Contact Numbers:** +91 7017905125 & +91 9358190766

---

## 🚀 Running Locally

```powershell
# Using Python
python -m http.server 8080 --directory sugerfit

# Or using Node
npx serve sugerfit -l 8080
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📁 File Structure

```
sugerfit/
├── images/
│   ├── head-office-card.jpg         # Official Head Office visiting card / document
│   ├── hero-poster.jpg              # Official campaign poster (mountain background)
│   ├── hindi-instructions-guide.jpg # Official printed Hindi instruction leaflet
│   ├── product-pamphlet.jpg         # Product flyer with offer details
│   └── product-studio-shot.png      # Studio product shot on woven mat
├── videos/
│   └── sugarfit-demo.mp4            # Official WhatsApp demonstration & unboxing video
├── index.html                       # Complete landing page with 3D canvas, video player & gallery
├── main.js                          # Three.js 3D engine, procedural textures, GSAP timeline
├── styles.css                       # Ayurvedic stylesheet, glassmorphism, pulse rings
└── README.md                        # Project documentation
```
