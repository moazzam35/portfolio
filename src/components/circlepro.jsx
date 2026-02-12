import { useEffect, useState } from "react";
// import "./SkillExample.css";

const skills = [
  { name: "CSS", value: 90 },
  { name: "React", value: 75 },
  { name: "JavaScript", value: 60 },
  { name: "Tailwind CSS", value: 85 },
];

export default function SkillExample() {
  const [progress, setProgress] = useState(skills.map(() => 0));

  useEffect(() => {
    skills.forEach((skill, index) => {
      let current = 0;
      const timer = setInterval(() => {
        current++;
        setProgress((prev) => {
          const updated = [...prev];
          updated[index] = current;
          return updated;
        });
        if (current === skill.value) clearInterval(timer);
      }, 18);
    });
  }, []);

  return (
    <>
    <div className="skill-container">
      {skills.map((skill, i) => (
        <div className="skill-box" key={i}>
          <div
            className="circle"
            style={{
              background: `conic-gradient(
                #ff2d2d ${progress[i] * 3.6}deg,
                #1a1a1a 0deg
              )`,
            }}
          >
            <div className="circle-inner">
              {progress[i]}%
            </div>
          </div>
          <span className="label">{skill.name}</span>
        </div>
      ))}
    </div>
    </>
  );
}
