import { useState } from "react";
import ActionButton from "./ActionButton";

const BuildRoadModal = ({ submit }: { submit: (x: number) => void }) => {
  const [capacity, setCapacity] = useState(1);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: "60%",
        }}
      >
        <b>1</b>
        <input
          type="range"
          min={1}
          max={10}
          value={capacity}
          onChange={(x) => {
            setCapacity(parseInt(x.target.value));
          }}
          className="slider"
        ></input>
        <b>10</b>
      </div>
      <div>
        <p>Road Capacity: {capacity}</p>
        <p>Road Cost: ${capacity * 10}</p>
      </div>
      <ActionButton onClick={() => submit(capacity)} text="Build Road" />
    </>
  );
};

export default BuildRoadModal;
