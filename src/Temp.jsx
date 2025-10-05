/* eslint-disable react/prop-types */
import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

const Temp = ({ temp, setMeme }) => {
  const row1 = useRef(null);
  const row2 = useRef(null);
  const row3 = useRef(null);

  useLayoutEffect(() => {
    const ctx1 = gsap.context(() => animateRow(row1.current, "right"), row1.current);
    const ctx2 = gsap.context(() => animateRow(row2.current, "left"), row2.current);
    const ctx3 = gsap.context(() => animateRow(row3.current, "bottom"), row3.current);

    return () => {
      ctx1.revert();
      ctx2.revert();
      ctx3.revert();
    };
  }, [temp]);

  const animateRow = (rowRef, direction) => {
    if (!rowRef) return;
    gsap.from(rowRef.children, {
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      stagger: { amount: 0.2, each: 0.1 },
      x: direction === "right" ? 100 : direction === "left" ? -100 : 0,
      y: direction === "bottom" ? 100 : 0,
    });
  };

  // Split memes into 3 rows (3 items per row)
  const rows = [
    temp.slice(0, 3),
    temp.slice(3, 6),
    temp.slice(6, 9),
  ];

  const rowRefs = [row1, row2, row3];

  return (
    <div className="Templates">
      {rows.map((rowMemes, rowIndex) => (
        <div className="row" ref={rowRefs[rowIndex]} key={`row-${rowIndex}`}>
          {rowMemes.map((meme) => (
            <div
              key={meme.id}
              className="template"
              onClick={() => setMeme(meme)}
            >
              <div
                style={{ backgroundImage: `url(${meme.url})` }}
                className="meme"
              >
                {/* Display meme name below the image */}
                <span
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: "5px",
                    color: "white",
                    fontWeight: "bold",
                    textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
                    fontSize: "14px",
                  }}
                >
                  {meme.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Temp;
