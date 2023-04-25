import { useState } from "react";
import ActionButton from "./ActionButton";

const BuildRoadModal = ({
  submit,
  budget,
}: {
  submit: (x: number) => void;
  budget: number;
}) => {
  const [capacity, setCapacity] = useState(1);
  const [error, setError] = useState("");

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
      {error !== "" ? <p style={{ color: "red" }}>{error}</p> : <></>}
      <ActionButton
        onClick={() => {
          if (budget - 10 * capacity < 0) {
            setError("You cannot afford this road!");
            return;
          }
          submit(capacity);
        }}
        text="Build Road"
      />
    </>
  );
};

export default BuildRoadModal;
