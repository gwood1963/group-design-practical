import React, { FC, useState } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';

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
  const toggleCollapse = () => {sliderState((state) => (state === "true" ? "false" : "true"))}; 
  const getSliderValue = (event:any=0) => {
      const newFlow = event.target.value
      console.log(data.allFlows);
      //@ts-ignore
      const rest = (data.allFlows).filter(edge => {return edge.id != data.ID})
      console.log(rest)
      data.flowFunc([...rest, {id: data.ID, flow: newFlow}])  //I tried to adapt what you had before to update the flows array. I don't think this works though.
      //I'm not sure that passing the function through flowFunc works. It's worth doing some reactFlow reasearch here.
      console.log(data.allFlows);
      
      console.log(data.flow);
  }

  return (
    <>
      <path 
        id={id} 
        className="react-flow__edge-path" 
        d={edgePath} 
        style = {{stroke: "rgb(5, 16, 46)", strokeWidth: "10px"}}
    />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#ffcc00',
            padding: 10,
            borderRadius: 5,
            fontSize: 16,
            fontWeight: 700,
            borderStyle: "solid",
            borderColor: "rgb(5, 16, 46)",
            borderWidth: "1px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          }}
          className="nodrag nopan slidecontainer"
        > 
          {sliderToggle === "true" && (
            <div>
              0 <input type="range" min="0" max={data.capacity} value={data.flow} className="slider" onChange={getSliderValue} onInput={getSliderValue}></input> {data.capacity}
            </div>
          )}
          <button className="edgebutton" onClick={toggleCollapse}>
            {data.flow}/{data.capacity} 
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default Round1Edge;
