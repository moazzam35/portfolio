import { useEffect, useRef } from "react";
import "./skills.css";
import SplitText from "../About/Split Text/SplitText";

const SKILLS = [
  { name: "React.js",        value: 75 },
  { name: "CSS",          value: 90 },
  { name: "JavaScript",   value: 60 },
  { name: "Next.js",      value: 80 },
  { name: "Tailwind CSS", value: 85 },
];

export default function Skills() {
  const fillRefs = useRef([]);
  const pctRefs  = useRef([]);

  useEffect(() => {
    const DUR = 1400;
    let start = null;

    const ease = t =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const frame = ts => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / DUR, 1);
      const e = ease(t);

      SKILLS.forEach((s, i) => {
        const v = Math.round(e * s.value);
        if (fillRefs.current[i]) fillRefs.current[i].style.width = v + "%";
        if (pctRefs.current[i])  pctRefs.current[i].textContent  = v;
      });

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        SKILLS.forEach((s, i) => {
          if (fillRefs.current[i]) fillRefs.current[i].style.width = s.value + "%";
          if (pctRefs.current[i])  pctRefs.current[i].textContent  = s.value;
        });
      }
    };

    const timer = setTimeout(() => requestAnimationFrame(frame), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="sk-root">
      <div className="sk-top">
        <h2 className="sk-heading">
          <SplitText text="Technical " />
          <SplitText style={{color : " #c8f135 "}} text="Skills" />
  
        </h2> 
      </div>

      <ul className="sk-list">
        {SKILLS.map((s, i) => (
          <li key={s.name} className="sk-row">
            <span className="sk-name">{s.name}</span>
            <div className="sk-track">
              <div
                className="sk-fill"
                ref={el => (fillRefs.current[i] = el)}
              />
            </div>
            <span
              className="sk-pct"
              ref={el => (pctRefs.current[i] = el)}
            >
              0
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}