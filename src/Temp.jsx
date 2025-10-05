/* eslint-disable react/prop-types */
import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

const Temp = ({ temp, setMeme, searchQuery }) => {
  const row1 = useRef(null);
  const row2 = useRef(null);
  const row3 = useRef(null);

  useLayoutEffect(() => {
    const ctx1 = gsap.context(() => {
      animateRow(row1.current, "right");
    }, row1.current);

    const ctx2 = gsap.context(() => {
      animateRow(row2.current, "left");
    }, row2.current);

    const ctx3 = gsap.context(() => {
      animateRow(row3.current, "bottom");
    }, row3.current);

    return () => {
      ctx1.revert();
      ctx2.revert();
      ctx3.revert();
    };
  }, [temp]);

  const animateRow = (rowRef, direction) => {
    gsap.from(rowRef.children, {
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      stagger: {
        amount: 0.2,
        each: 0.1,
      },
      x: direction === "right" ? 100 : direction === "left" ? -100 : 0,
      y: direction === "bottom" ? 100 : 0,
    });
  };

  // Filter memes by name OR description
  const filteredTemp = temp.filter(
    (meme) =>
      meme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (meme.description &&
        meme.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderRow = (sliceStart, sliceEnd, rowRef) =>
    filteredTemp.slice(sliceStart, sliceEnd).map((temps) => (
      <div key={temps.id} className="template" onClick={() => setMeme(temps)}>
        <div
          style={{ backgroundImage: `url(${temps.url})` }}
          className="meme"
        ></div>
      </div>
    ));

  return (
    <div className="Templates">
      <div className="row" ref={row1}>
        {renderRow(0, 3, row1)}
      </div>
      <div className="row" ref={row2}>
        {renderRow(3, 6, row2)}
      </div>
      <div className="row" ref={row3}>
        {renderRow(6, 9, row3)}
      </div>
    </div>
  );
};

export default Temp;
