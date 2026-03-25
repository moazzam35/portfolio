import DecryptedText from "../text-decrypt/DecryptedText";
import TextType from "./Rewrite Text/TextType";
function Hero() {
  return (
    <div
      className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
      id="home"
    >
      <h1 className="text-4xl font-bold">
        <TextType
          typingSpeed={75}
          pauseDuration={1500}
          showCursor
          cursorCharacter="_"
          text={[
            "Hello, I'm Moazzam",
            "Frontend Developer & UI Engineer",
            "Turning ideas into interactive designs",
            "Responsive & performance-focused",
            "Let's build something amazing",
          ]}
          deletingSpeed={40}
          variableSpeedEnabled={false}
          variableSpeedMin={60}
          variableSpeedMax={120}
          cursorBlinkDuration={0.5}
        />
      </h1>
      <h1 className="mt-4 text-lg">
        <div
          className="text-gray-100 w-full"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
        >
          Welcome to my portfolio
        </div>
      </h1>
    </div>
  );
}

export default Hero;
