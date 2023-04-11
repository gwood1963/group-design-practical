import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
//@ts-ignore
export default memo(({data}) => {
  return (
    <>
      <Handle
        type="target"
        id = "left"
        position={Position.Left}
        style={{ bottom: 10, top: 'auto', background: '#555' }}
        isConnectable= {false}
      />
      <div className = "ImageNode" style = {{width: "45px", height: "45px", zIndex: "-100"}}>
        <img src={data.image} width="100%" height = "100%" />
        <div style= {{display: "flex", justifyContent: "center", fontWeight: "bold", fontSize: "14px", color: data.color}}>{data.label}</div>

      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ bottom: 10, top: 'auto', background: '#555' }}
        isConnectable= {false}
      />


    </>
  );
});


