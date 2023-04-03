

import React, { FC } from 'react';
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
          className="nodrag nopan"
        >
          {data.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default Round1Edge;
