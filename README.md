# LUXE — Premium Fashion Store

A modern, high-performance Single Page Application (SPA) e-commerce platform built entirely with Vanilla JavaScript, HTML, and CSS. LUXE features a minimalist, editorial design and a robust backend powered by Firebase, complete with a fully functional custom client-side router and payment integration.

## 🌟 Features

- **Custom SPA Router:** A lightweight, vanilla JavaScript routing system (`js/router.js`) that handles seamless page transitions without reloads.
- **State Management:** Centralized state handling (`js/store.js`) for cart, user authentication, and application settings.
- **Authentication:** Integrated Firebase Authentication for secure user signup, login, and session management.
- **Real-time Database:** Utilizes Firebase Realtime Database and Storage for product data, user profiles, and order history.
- **Payment Gateway:** Integrated Razorpay Checkout SDK for processing secure online payments.
- **Component-Based UI:** Modular frontend architecture with reusable components (Nav, Footer, Modals, Toasts, Product Cards).
- **Admin Dashboard:** A dedicated interface for managing products, viewing orders, and administrative tasks.
- **Responsive Design:** A fluid layout tailored for all devices (Mobile, Tablet, Desktop) using custom CSS and modern practices.

## 🛠 Tech Stack

- **Frontend:** HTML5, CSS3 (Custom Variables, Flexbox, Grid), Vanilla JavaScript (ES6 Modules)
- **Backend & Storage:** Firebase (App, Auth, Database, Storage)
- **Payments:** Razorpay
- **Fonts:** Playfair Display (Serif), Lato (Sans-Serif) via Google Fonts

## 📂 Project Structure

```
shopping/
├── css/                   # Stylesheets
│   ├── base.css           # CSS Variables, resets, and typography
│   ├── components.css     # Styles for reusable components
│   ├── pages.css          # Page-specific styling
│   └── responsive.css     # Media queries for all viewports
├── data/                  # Static data assets (JSON, etc.)
├── js/                    # JavaScript Source Code
│   ├── app.js             # Main application entry point
│   ├── firebase.js        # Firebase initialization and configuration
│   ├── router.js          # Custom SPA routing logic
│   ├── store.js           # Global state management
│   ├── components/        # Reusable UI components
│   │   ├── footer.js, heroSlider.js, loader.js, modal.js, 
│   │   ├── navbar.js, productCard.js, toast.js
│   ├── pages/             # Logic for individual views/pages
│   │   ├── admin.js, cart.js, checkout.js, contact.js, faq.js,
│   │   ├── home.js, login.js, orders.js, productDetail.js, 
│   │   ├── products.js, profile.js, returns.js, shipping.js, wishlist.js
│   └── utils/             # Utility functions
│       ├── coupons.js, helpers.js
├── index.html             # Main entry HTML file
├── firebase.json          # Firebase hosting configuration
└── database.rules.json    # Firebase Realtime Database security rules
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser.
- A local development server (like VS Code Live Server, or Python `http.server`) to serve the ES6 modules correctly.

### Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone <repository-url>
   cd shopping
   \`\`\`

2. **Firebase Setup:**
   - Create a new project on the [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** (Email/Password), **Realtime Database**, and **Storage**.
   - Copy your Firebase config object and replace the configuration in `js/firebase.js`.
   - Update `database.rules.json` to your Firebase project if necessary.

3. **Razorpay Setup:**
   - Create an account on [Razorpay](https://razorpay.com/).
   - Obtain your Test/Live API keys and integrate them into the checkout logic (`js/pages/checkout.js`).

4. **Run Locally:**
   Start a local server in the root directory.
   - Using Python: `python -m http.server 8000`
   - Using Node.js (http-server): `npx http-server`
   - Or use the "Live Server" extension in VS Code.

   Navigate to `http://localhost:8000` in your browser.

## 🎨 Design Philosophy

LUXE aims to provide a premium, editorial shopping experience. The design focuses on:
- **Minimalism:** Ample whitespace and borderless card designs.
- **Typography:** A sophisticated hierarchy using Playfair Display for headings and Lato for body text.
- **Imagery First:** A softer color palette (Theme Color: `#FAF9F6`) to ensure product photography stands out.
- **Micro-interactions:** Subtle hover states and smooth page transitions for a dynamic feel.

## 📝 License

This project is licensed under the MIT License.
