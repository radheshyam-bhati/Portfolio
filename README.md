# Radheshyam Bhati - Personal Portfolio

A cyberpunk-themed, high-performance static portfolio website built with HTML, CSS (Tailwind CSS), and JavaScript. 

## 🚀 Live Demo

[https://radheshyam-cod.github.io/radheshyam-portfolio/](https://radheshyam-cod.github.io/radheshyam-portfolio/) *(Subject to your actual GitHub Pages URL)*

## 🛠 Features & Technology Stack

- **Frontend Core**: Vanilla HTML5, CSS3, ES6 JavaScript.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Compiled into `styles.css`).
- **Animations**: [GSAP](https://gsap.com/) for scroll-triggered reveals, 3D hover effects, and parallax micro-interactions.
- **Smooth Scrolling**: [Lenis](https://lenis.studiofreight.com/) for seamless vertical scrolling.
- **Contact Form**: Powered by [FormSubmit](https://formsubmit.co/) (No backend required!).
- **Hosting**: Statically hosted on GitHub Pages for zero-latency loading.

## 📂 Project Structure

```text
.
├── index.html       # Main portfolio single page
├── script.js        # GSAP animations, Lenis setup, and Form logic
├── styles.css       # Compiled Tailwind CSS and custom animations
├── image.png        # Profile image used in the Hero section
├── Resume.pdf       # Downloadable resume
├── assets/          # Local font files (Space Grotesk)
├── vendor/          # Local GSAP & Lenis scripts
└── certificates/    # PDF certificates
```

## 💻 Local Development

Since the portfolio was recently migrated to be entirely static, there's no need for an `npm` build step, Node.js installation, or an Express backend server.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/radheshyam-cod/radheshyam-portfolio.git
   cd radheshyam-portfolio
   ```

2. **Run locally:**
   You can serve the directory using any static file server. For example:
   
   Using Python:
   ```bash
   python3 -m http.server
   ```
   *Or* using Node.js/npx:
   ```bash
   npx serve .
   ```
   *Or* simply use the **Live Server** extension in VS Code.

3. Open `http://localhost:8000` (or the port specified by your server) in your browser.

## ✉️ Contact Form Configuration

The contact form uses [FormSubmit](https://formsubmit.co/) to forward messages directly to email without requiring a custom backend server.

To modify the recipient, change the email address in `script.js` located in the `fetch` request inside the `initContactForm` function:

```javascript
// script.js
const response = await fetch("https://formsubmit.co/ajax/your-email@example.com", {
  // ...
});
```

*Note: You must activate the FormSubmit endpoint by submitting the form once and confirming your email address via the link FormSubmit sends you.*
