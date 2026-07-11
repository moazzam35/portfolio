import Particles from "./particals-bg";
 
function Bg() {
  return (
    <div className="bg-black overflow-x-hidden h-screen w-full relative">
          <Particles
            particleColors={["#bca9a9"]}
            particleCount={500}
            particleSpread={10}
            speed={0.25}
            particleBaseSize={100}
            moveParticlesOnHover
            alphaParticles={false}
            disableRotation={false}
            pixelRatio={1}
          />
        </div>
  )
}
export default Bg;