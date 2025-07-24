import React from "react";
import facebook from '../images/facebook.png'
import google from "../images/google.png";
import instagram from "../images/instagram.jpeg";
import linkedin from "../images/linkedin.png";
import youtube from "../images/youtube.jpeg";

function Footer() {
  const socialIcons = [facebook, google, instagram, linkedin, youtube];

  return (
    <footer className="bg-blue-600 text-white py-10 px-4">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Lynk</h2>
        <p className="mt-2 max-w-xl mx-auto">
          Lynk is a social media platform where you connect with friends, family,
          and like-minded people. Share your moments in a vibrant, safe space.
        </p>
      </div>
      <div className="flex justify-center gap-6 mt-6">
        {socialIcons.map((icon, i) => (
          <img
            key={i}
            src={icon}
            onClick={()=>{alert("just kept for show case")}}
            alt={`social-icon-${i}`}
            className="w-10 h-10 rounded-full object-cover hover:scale-110 transition duration-300"
          />
        ))}
      </div>
      <p className="text-center mt-6 text-sm opacity-80">&copy; 2025 Lynk. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
