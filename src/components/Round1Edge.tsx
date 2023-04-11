import React, { FC, useState } from "react";
import { EdgeProps, getBezierPath, EdgeLabelRenderer , getSmoothStepPath, getSimpleBezierPath} from "reactflow";

const Round1Edge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [sliderToggle, sliderState] = useState("false");
  const [z, setz] = useState<number>(1);
  const [flow, setFlow] = useState(0);
  const toggleCollapse = () => {
    sliderState((state) => (state === "true" ? "false" : "true"));
    setz((z) => (z === 1 ? 200 : 1)) 
  };
  const getSliderValue = (event: any = 0) => {
    const newFlow = event.target.value;
    setFlow(newFlow);
    data.setFlow((old: any) =>
      old.map((flow: any) =>
        flow.id === data.id ? { id: data.id, flow: parseInt(newFlow) } : flow
      )
    );
  };

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{ stroke: "rgb(5, 16, 46)", strokeWidth: "5px" }}
      />
      <EdgeLabelRenderer>
        <div id = "edgeLabel"
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`, 
            background: "#ffcc00",
            padding: 3,
            borderRadius: 5,
            fontSize: 16,
            fontWeight: 700,
            borderStyle: "solid",
            borderColor: "rgb(5, 16, 46)",
            borderWidth: "1px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
            zIndex: String(z),
          }}
          className="nodrag nopan slidecontainer"
        >
          {sliderToggle === "true" && (
            <div >
              0{" "}
              <input
                type="range"
                min="0"
                max={data.capacity}
                value={flow}
                className="slider"
                onChange={getSliderValue}
              ></input>{" "}
              {data.capacity}
            </div>
          )}
          <button className="edgebutton" onClick = {toggleCollapse}>
            {flow}/{data.capacity}
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default Round1Edge;
