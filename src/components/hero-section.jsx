import DecryptedText from "./text-decrypt/DecryptedText";

function Hero() {
  return (
    <div className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center" id="home">
      <h1 className="text-4xl font-bold">
        <DecryptedText text="Hello I'm a Front-End Developer" />
      </h1>
      <h1 className="mt-4 text-lg">
        <div className="text-gray-100 w-full" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
          Welcome to my portfolio
        </div>
      </h1>
    </div>
  );
}

export default Hero;
