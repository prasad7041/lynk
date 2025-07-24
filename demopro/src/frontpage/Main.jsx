import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import image from "../images/Screenshot from 2025-03-19 11-13-46.png"
function Main() {
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" }
    );
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1.5, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between px-16 py-20 bg-white">
      <div ref={textRef} className="text-6xl font-extrabold text-blue-600 leading-snug max-w-xl">
        share, <br />
        <span className="text-blue-800">laugh,</span> <br />
        <span className="text-blue-400">repeat.</span>
      </div>
      <img
        ref={imageRef}
        src={image}
        className="max-w-md w-full h-auto object-contain rounded-2xl"
        alt="Main visual"
      />
    </div>
  );
}

export default Main;
