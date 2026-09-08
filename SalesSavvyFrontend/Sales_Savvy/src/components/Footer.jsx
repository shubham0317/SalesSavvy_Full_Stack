import React from "react";

function Footer() {

  return (

    <footer className="footer">

      <div className="footer-content">

        <div className="footer-brand">

          <h3>
            SalesSavvy
          </h3>

          <p>
            Your one-stop shop for
            all your needs.
          </p>

        </div>


        <div className="footer-links">

          <a href="/about">
            About Us
          </a>

          <a href="/contact">
            Contact
          </a>

          <a href="/terms">
            Terms of Service
          </a>

          <a href="/privacy">
            Privacy Policy
          </a>

        </div>

      </div>


      <div className="footer-bottom">

        <p>
          © 2026 SalesSavvy.
          All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;