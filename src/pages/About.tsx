import React from "react";

const About: React.FC = () => (
	<div className="min-h-screen bg-[#0b0708] text-white font-sans leading-relaxed flex flex-col items-center justify-center px-4">
		<div className="w-full max-w-3xl py-12 sm:py-16 md:py-20">
			<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#f7b500] mb-4 sm:mb-6 text-center">About Us</h1>
			<p className="text-base sm:text-lg text-white/90 mb-4 sm:mb-6 text-center">
				Yasa Graphics is a creative studio dedicated to helping brands stand out through stunning visual design. Our team specializes in logo design, branding, social media graphics, posters, banners, and more.
			</p>
			<p className="text-sm sm:text-base text-white/80 text-center">
				We believe in the power of design to tell stories, build trust, and drive business growth. With a passion for creativity and a commitment to quality, we deliver modern, effective visuals that make an impact.
			</p>
		</div>
	</div>
);

export default About;
