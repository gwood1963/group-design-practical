import { useState } from "react";
import ActionButton from "./ActionButton";
import { Round2 } from "../game/Round2.js"

const BuildRoadModal = ({
  submit,
  budget,
  round,
  i,
  j
}: {
  submit: (x: number) => void;
  budget: number;
  round: Round2 | undefined;
  i: Number;
  j: Number;
}) => {
  if (round == undefined) {console.log("round undefined"); round = new Round2} //this line should never run, just here for typing issues
  const [capacity, setCapacity] = useState(1);
  const [error, setError] = useState("");
  const [cost, setCost] = useState(0/* round.roadCost(i, j, 1) */);

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
            if (round == undefined) {console.log("round undefined"); round = new Round2} //this line should never run
            //console.log(capacity);
            //setCost(round.roadCost(i, j, capacity));
            /* console.log("1: ");
            console.log(cost); */
            setCapacity(parseInt(x.target.value));
            setCost(round.roadCost(i, j, capacity));
            /* console.log("2: ");
            console.log(cost); */
            //console.log(capacity);
          }}
          className="slider"
        ></input>
        <b>10</b>
      </div>
      <div>
        <p>Road Capacity: {capacity}</p>
        <p>Road Cost: ${ (!Number.isNaN(i) && !Number.isNaN(j)) ? round.roadCost(i, j, capacity) : 0/* cost *//* capacity * 10 */}</p> 
      </div>
      {error !== "" ? <p style={{ color: "red" }}>{error}</p> : <></>}
      <ActionButton
        onClick={() => {
          if (budget - cost/* 10 * capacity */ < 0) {
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
