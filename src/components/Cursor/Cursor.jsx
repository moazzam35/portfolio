import { useEffect, useRef, useCallback } from "react";
import "./cursor.css";

/**
 * CustomCursor — Premium sharp arrow + diamond follower
 *
 * Features:
 *   • Sharp minimal white arrow  (exact mouse position)
 *   • Small green diamond follower with smooth lag
 *   • Hover → follower expands into a pill labeled "VIEW →"
 *   • Custom label per element: data-cursor-label="OPEN ↗"
 *   • Click → particle burst + scale flash
 *
 * Usage:
 *   import CustomCursor from "./CustomCursor";
 *   export default function App() {
 *     return <><CustomCursor /><YourApp /></>;
 *   }
 *
 * Brand color: change --c-accent in cursor.css
 */
export default function CustomCursor() {
  const arrowRef    = useRef(null);
  const followerRef = useRef(null);
  const rafRef      = useRef(null);
  const mouse       = useRef({ x: -400, y: -400 });
  const pos         = useRef({ x: -400, y: -400 });

  const lerp = (a, b, t) => a + (b - a) * t;

  const spawnParticles = useCallback((x, y) => {
    const count = 7;
    for (let i = 0; i < count; i++) {
      const el    = document.createElement("div");
      el.className = "c-particle";
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const dist  = 16 + Math.random() * 26;
      const tx    = Math.cos(angle) * dist;
      const ty    = Math.sin(angle) * dist;
      el.style.cssText = `left:${x}px;top:${y}px`;
      document.body.appendChild(el);
      el.animate(
        [
          { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
          { transform: `translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px)) scale(0)`, opacity: 0 },
        ],
        { duration: 400, easing: "ease-out", fill: "forwards" }
      ).onfinish = () => el.remove();
    }
  }, []);

  useEffect(() => {
    const HOVER = "a,button,[role='button'],input,select,textarea,label,[data-cursor='hover']";

    const show = () => {
      arrowRef.current?.classList.remove("c--hidden");
      followerRef.current?.classList.remove("c--hidden");
    };
    const hide = () => {
      arrowRef.current?.classList.add("c--hidden");
      followerRef.current?.classList.add("c--hidden");
    };

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      show();
    };

    const onOver = (e) => {
      const el = e.target.closest(HOVER);
      if (el) {
        arrowRef.current?.classList.add("c--hover");
        followerRef.current?.classList.add("c--hover");
        const lbl = followerRef.current?.querySelector(".c-follower__label");
        if (lbl) lbl.textContent = el.dataset.cursorLabel || "VIEW →";
      }
    };
    const onOut = (e) => {
      if (e.target.closest(HOVER)) {
        arrowRef.current?.classList.remove("c--hover");
        followerRef.current?.classList.remove("c--hover");
        const lbl = followerRef.current?.querySelector(".c-follower__label");
        if (lbl) lbl.textContent = "VIEW →";
      }
    };

    const onDown = (e) => {
      arrowRef.current?.classList.add("c--click");
      followerRef.current?.classList.add("c--click");
      spawnParticles(e.clientX, e.clientY);
    };
    const onUp = () => {
      arrowRef.current?.classList.remove("c--click");
      followerRef.current?.classList.remove("c--click");
    };

    const tick = () => {
      if (arrowRef.current)
        arrowRef.current.style.transform = `translate(${mouse.current.x}px,${mouse.current.y}px)`;

      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.10);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.10);
      if (followerRef.current)
        followerRef.current.style.transform = `translate(${pos.current.x}px,${pos.current.y}px)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("mousemove",  onMove, { passive: true });
    window.addEventListener("mouseover",  onOver);
    window.addEventListener("mouseout",   onOut);
    window.addEventListener("mousedown",  onDown);
    window.addEventListener("mouseup",    onUp);
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseover",  onOver);
      window.removeEventListener("mouseout",   onOut);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
    };
  }, [spawnParticles]);

  return (
    <>
      <div ref={arrowRef} className="c-arrow c--hidden" aria-hidden="true">
        <svg className="c-arrow__svg" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="c-arrow__body" d="M3 3 L3 18.5 L7.5 14 L11 21 L13.5 19.8 L10 13 L16.5 13 Z" />
          <path className="c-arrow__rim"  d="M3 3 L3 18.5 L7.5 14 L11 21 L13.5 19.8 L10 13 L16.5 13 Z" />
          <line className="c-arrow__spine" x1="3" y1="3" x2="3" y2="18.5" />
        </svg>
      </div>

      <div ref={followerRef} className="c-follower c--hidden" aria-hidden="true">
        <div className="c-follower__shape">
          <span className="c-follower__label">VIEW →</span>
        </div>
      </div>
    </>
  );
}