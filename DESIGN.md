---
name: Clinical Serenity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#404750'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#717881'
  outline-variant: '#c0c7d1'
  surface-tint: '#00639a'
  primary: '#005687'
  on-primary: '#ffffff'
  primary-container: '#1a6fa8'
  on-primary-container: '#deedff'
  inverse-primary: '#96ccff'
  secondary: '#556068'
  on-secondary: '#ffffff'
  secondary-container: '#d9e4ee'
  on-secondary-container: '#5b666e'
  tertiary: '#3d5372'
  on-tertiary: '#ffffff'
  tertiary-container: '#566b8c'
  on-tertiary-container: '#e2ecff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cee5ff'
  primary-fixed-dim: '#96ccff'
  on-primary-fixed: '#001d32'
  on-primary-fixed-variant: '#004a76'
  secondary-fixed: '#d9e4ee'
  secondary-fixed-dim: '#bdc8d1'
  on-secondary-fixed: '#121d24'
  on-secondary-fixed-variant: '#3e4850'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#b2c8ed'
  on-tertiary-fixed: '#021c39'
  on-tertiary-fixed-variant: '#324866'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '300'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  button:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  section-gap: 120px
  container-max: 1280px
---

## Brand & Style

The design system is rooted in the "Clinical Serenity" aesthetic—a sophisticated blend of high-end minimalism and modern corporate reliability. It is designed to instill immediate confidence and a sense of calm in patients and healthcare professionals alike. 

The visual language avoids the cluttered, high-intensity feel of traditional medical portals, opting instead for a breathable, "airy" layout that prioritizes clarity of information. By utilizing a flat design approach with absolutely no gradients or heavy shadows, the system achieves a premium, honest feel. The focus remains on precision, high-quality typography, and purposeful whitespace to reduce cognitive load during potentially stressful user journeys.

## Colors

This design system utilizes a restrained, high-contrast palette to define hierarchy. **White (#FFFFFF)** serves as the primary canvas, ensuring maximum light reflectance and cleanliness. **Soft Light Gray (#F8FAFC)** is used for large structural section fills to subtly distinguish content blocks without breaking the flow.

**Primary Blue (#1A6FA8)** is reserved strictly for action-oriented elements and key accents, providing a professional "medical blue" that feels modern rather than institutional. **Dark Navy (#0F2744)** provides grounding for headings, offering excellent legibility and an authoritative tone. Body copy is rendered in **Muted Slate (#64748B)** to soften the visual impact and improve long-form reading comfort. Functional highlights, such as tags and selected states, use the **Light Blue Tint (#E6F1FB)** to maintain a cohesive, monochromatic blue thread throughout the interface.

## Typography

The design system employs **Inter** for its systematic clarity and humanist qualities. The type scale is characterized by a "Confident Header" approach—large, bold navy headings that clearly define the page structure. 

To contrast the heavy headings, body text is intentionally set in a **light weight (300)**. This creates an elegant, editorial feel that enhances the "airy" quality of the layout. Generous line heights are applied to all body styles to ensure accessibility and a relaxed reading pace. All labels and functional text (like button labels) use a medium weight to ensure they remain legible and distinct from the lighter body prose.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model centered within the viewport, maximizing the use of white space to create a premium feel. The container is capped at 1280px to maintain optimal line lengths for reading.

A rigorous 8px spatial grid governs all margins and paddings. Section vertical spacing is exceptionally generous (120px) to allow the "breathability" requested in the design brief. Components and grouped items use a 16px or 32px rhythm to maintain clear relationships. Information density should be kept low; if a screen feels crowded, spacing should be increased rather than font size decreased.

## Elevation & Depth

This design system explicitly avoids depth created by shadows or light-source simulation. Instead, it utilizes **Low-contrast Outlines** and **Tonal Layering** to communicate hierarchy.

- **Flat Planes:** Surfaces do not "lift" off the page. Depth is implied by the 0.5px border (#E2E8F0) which acts as a razor-thin containment line for cards and modules.
- **Tonal Contrast:** The transition from a white (#FFFFFF) background to a light gray (#F8FAFC) section fill is the primary method for defining content areas.
- **Zero Shadow Policy:** No drop shadows or inner shadows are permitted. Interactive states should be signaled by color shifts (e.g., a slightly darker blue on hover) or border color changes rather than elevation.

## Shapes

The shape language is controlled and precise. The design system uses a **Soft** roundedness level to maintain a friendly but professional appearance.

- **Standard Elements:** Most containers and cards utilize a subtle 8px corner radius.
- **Buttons:** Specifically set to a **6px radius**, providing a sharp, tailored look that feels more modern and bespoke than a standard rounded corner.
- **Tags & Badges:** Use a full **Pill-shape (999px)** to differentiate them from interactive buttons and structural cards. This softer shape for meta-data elements provides a visual "rest" from the otherwise geometric layout.

## Components

### Buttons
- **Primary:** Solid Primary Blue (#1A6FA8) with white text. 6px corners. No shadow.
- **Secondary:** Transparent background with a 1px (or 0.5px) Primary Blue border and blue text. 6px corners.
- **Ghost:** No border or fill, primary blue text, used for less prominent actions.

### Cards
Cards are defined by a white background and a **0.5px light border (#E2E8F0)**. They should never have shadows. Padding within cards should be generous (min 32px) to maintain the airy aesthetic.

### Tags & Chips
Informational tags are pill-shaped with a **Light Blue Tint (#E6F1FB)** background and Primary Blue text. They are used for department names, status indicators, or category labels.

### Input Fields
Inputs use a white background with a 1px border (#E2E8F0). On focus, the border changes to Primary Blue. Typography inside inputs follows the label-md or body-md specification.

### Dividers
Vertical and horizontal dividers must be 0.5px thick using the border color (#E2E8F0). They should be used sparingly, relying on whitespace first for separation.

### Medical-Specific Components
- **Doctor Profile Snippet:** A clean card with a circular headshot, h3 for the name, and a pill-shaped tag for the specialty.
- **Availability Toggle:** Simple, flat toggle switches using the primary blue for the "on" state.
- **Appointment Slot:** A light gray (#F8FAFC) box that turns solid Primary Blue when selected.