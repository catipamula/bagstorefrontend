import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import heroImage from '../assets/woman-with-shopping-bags.jpg'; // make sure image exists in src/assets/
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="landing-container">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Bag</h1>
          <p>Shop premium bags and accessories at unbeatable prices</p>
          <Link to="/login" className="btn btn-primary">Shop Now</Link>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Landing Bag"/>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="categories-section">
        <h2>Popular Categories</h2>
        <div className="categories-container">
          <Link to="/home" className="category-card">Audio & HeadPhones</Link>
          <Link to="/home" className="category-card">Computer Accessories</Link>
          <Link to="/home" className="category-card">Travel Bags</Link>
          <Link to="/home" className="category-card">Laptop Bags</Link>
        </div>
      </section>

      {/* About Section */}
<section className="about-section">
  <h2>About Mini Shopping Store</h2>
  <p>
    At Mini Bag Store, we believe in combining style, functionality, and affordability. 
    Our curated collection of premium bags caters to all occasions — whether it's daily commuting, travel, or a casual outing.
    We focus on quality craftsmanship, trendy designs, and customer satisfaction.
  </p>
  <p>
    Follow us on social media for the latest trends, exclusive deals, and bag styling tips!
  </p>

</section>
{/* Contact Section */}
<section className="contact-section">
  <h2>Contact Us</h2>
  <p>Have questions or feedback? We'd love to hear from you!</p>
  
  <div className="contact-form">
    <form action="https://formspree.io/f/mdkdjazd" method="POST">
      <input type="text" name="name" placeholder="Your Name" required />
      <input type="email" name="email" placeholder="Your Email" required />
      <textarea name="message" placeholder="Your Message" required></textarea>
      <button type="submit">Send Message</button>
    </form>
  </div>
</section>



      {/* Footer */}

<footer className="landing-footer bg-gray-800 text-white py-6">
  <div className="flex justify-center space-x-6 mb-4 footer-social">
    <a
      href="https://facebook.com"
      target="_blank"
      rel="noreferrer"
      aria-label="Facebook"
      className="text-gray-400 hover:text-blue-600 transition"
    >
      <FaFacebookF size={20} />
    </a>
    <a
      href="https://instagram.com"
      target="_blank"
      rel="noreferrer"
      aria-label="Instagram"
      className="text-gray-400 hover:text-pink-500 transition"
    >
      <FaInstagram size={20} />
    </a>
    <a
      href="https://twitter.com"
      target="_blank"
      rel="noreferrer"
      aria-label="Twitter"
      className="text-gray-400 hover:text-blue-400 transition"
    >
      <FaTwitter size={20} />
    </a>
  </div>
  <p className="text-center text-gray-500 text-sm">
    &copy; 2025 Mini Bag Store. All rights reserved.
  </p>
</footer>

    </div>
  );
}

export default LandingPage;
