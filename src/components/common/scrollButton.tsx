import { useRef } from "react";
import useIsVisible from "hooks/useIsVisible";
import { ReactComponent as BackArrow } from "icons/arrowDown.svg";

const ScrollButton = () => {
  const bottomDivRef = useRef<HTMLDivElement>(null);
  const isVisbible = useIsVisible(bottomDivRef);

  const scrollDown = () => {
    bottomDivRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  return (
    <>
      <button
        className={`scroll-button ${!isVisbible && "scroll-visible"}`}
        onClick={scrollDown}
      >
        <BackArrow />
      </button>

      <div key={"bottomDiv"} ref={bottomDivRef}></div>
    </>
  );
};

export default ScrollButton;
