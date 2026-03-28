# **Project Overview: Young-in's Birthday Party Portal**

This project is a vibrant, interactive web application designed to celebrate Young-in's birthday. It features a festive design, interactive elements like fireworks, and a heartwarming message for friends. It leverages framework-less web standards (Baseline) and modern CSS/JS for an optimal user experience.

## **Project Outline & Implemented Features**

*   **Festive Design (v1.1.0):**
    *   Vibrant, celebratory color palette using `oklch`.
    *   Expressive typography and party-themed iconography.
    *   Responsive layout for all devices.
    *   **Interactive Fireworks:** A button that triggers a colorful confetti/fireworks effect using `canvas-confetti`.
    *   **Heartwarming Message:** A button that displays a special thank-you message: "생일축하해줘서 고마워 유빈아 사랑행".
    *   **Disqus Integration:** Kept for friends to leave birthday wishes.

## **Current Plan: Birthday Celebration Implementation**

1.  **UI/UX Design:**
    *   Update colors to be more festive (pinks, purples, golds).
    *   Add floating animations or festive background elements.
    *   Ensure buttons have a "glow" effect and satisfying hover states.

2.  **Implementation Steps:**
    *   **HTML:**
        *   Change title to "영인이 생일파티에 온걸 환영해!".
        *   Add two main interactive buttons.
        *   Include `canvas-confetti` library via CDN.
        *   Create a placeholder for the special message.
    *   **CSS:**
        *   Update variables for a festive theme.
        *   Add animations for a "party" feel.
        *   Style the special message container with elegant typography.
    *   **JS:**
        *   Implement the fireworks logic using `confetti()`.
        *   Implement the button logic to reveal the special message with a smooth fade-in.
