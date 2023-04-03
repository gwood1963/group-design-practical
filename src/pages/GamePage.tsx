import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import MainWrapper from "../components/ContentWrapper";
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import React, { useCallback } from 'react';
import {
  Controls,
  Background,
  addEdge,
  Connection,
  Edge,
  EdgeTypes,
  Node,
  useEdgesState,
  useNodesState,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import Round1Edge from '../components/Round1Edge';
import ImageNode from '../components/ImageNode'



const GamePage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState<number>(0);
  const [collapseButton, collapseState] = useState("+");
  const toggleCollapse = () => {
    collapseState((state) => (state === "-" ? "+" : "-"));
  };
  let start = 0;
  useEffect(() => {
    start = Date.now() / 1000;
    const interval = setInterval(() => {
      setTime(3000 - Math.floor(Date.now() / 1000 - start));
    }, 1000);

    return () => clearInterval(interval);
  }, []);



/**BELOW IS THE SET UP FOR THE PUZZLE DISPLAY */
/** ---------------------------------------------------- */


  /**TO DO: the x and y coordinates need to be taken from an array. */
  function scalex(x:number) {return x*12.5} /**These scale functions are likely now redundant as I have worked out there is a fitView function. However they are left here in case we still need to convert David's position output into coordinates. */
  function scaley(y:number) {return y*6.5}
  const initialNodes = [
    { id: '1', type: "ImageNode", position: { x: scalex(10) , y: scaley(50) }, data: { label: 'START', image: "/building2trees.svg", color: "green"} },
    { id: '2', type: "ImageNode", position: { x: scalex(20), y: scaley(30) }, data: { label: '', image: "/church.svg" ,color: "black" } },
    { id: '3', type: "ImageNode",position: { x: scalex(20), y: scaley(80) }, data: { label: '' , image: "/skyscraper.svg", color: "black" } },
    { id: '4', type: "ImageNode",position: { x: scalex(50), y: scaley(40) }, data: { label: '', image: "/building2trees.svg", color: "black"  } },
    {id: '5', type: "ImageNode",position: { x: scalex(60), y: scaley(60) }, data: { label: '' , image: "/factory.svg", color: "black" } },
    {id: '6', type: "ImageNode",position: { x: scalex(70), y: scaley(20) }, data: { label: '' , image: "/skyscraper.svg", color: "black" } },
    {id: '7', type: "ImageNode", position: { x: scalex(80), y: scaley(50) }, data: { label: 'END', image: "/building2trees.svg", color: "red"  } },
  ];
  /**TO DO: add a label to the start node which says how many people need to get accross.  */

  /**TO DO: The data labels in the edges below need to be taken from the live flow (stored in an array?) and the capacities from the array of capacities */
  /**TO DO: implement that the source and targets are taken from the adjacency list generated */
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, type: "Round1Edge", data: {label: '5/12'}},
    { id: 'e2-4', source: '2', target: '4', animated: true, type: "Round1Edge", data: {label: '4/8'}},
    { id: 'e4-6', source: '4', target: '6', animated: true, type: "Round1Edge", data: {label: '0/2'}},
    { id: 'e4-7', source: '4', target: '7', animated: true, type: "Round1Edge", data: {label: '2/10'}},
    { id: 'e6-7', source: '6', target: '7', animated: true, type: "Round1Edge", data: {label: '5/9'}},
    { id: 'e5-7', source: '5', target: '7', animated: true, type: "Round1Edge", data: {label: '2/3'}},
    { id: 'e2-5', source: '2', target: '5', animated: true, type: "Round1Edge", data: {label: '5/10'}},
    { id: 'e1-3', source: '1', target: '3', animated: true, type: "Round1Edge", data: {label: '1/11'}},
    { id: 'e3-5', source: '3', target: '5', animated: true, type: "Round1Edge", data: {label: '7/7'}},
    { id: 'e1-2', source: '1', target: '2', animated: true, type: "Round1Edge", data: {label: '5/10'}},
    { id: 'e5-7', source: '5', target: '7', animated: true, type: "Round1Edge", data: {label: '2/4'}},
  ];

  const edgeTypes: EdgeTypes = {
    'Round1Edge': Round1Edge,
  };

  const nodeTypes = React.useMemo(() => ({ "ImageNode": ImageNode }), []);
  
  /**------------------------------------------------------------------------------------------------------------ */
  

  return (
    <MainWrapper flexDirection="column">
      <div className = "navBar"
      >
        <div
          id="Timer"
          style={{
            margin: "1rem",
            padding: "0.5rem",
            color: "white",
            border: "2px solid rgba(118, 50, 50, 1)",
            backgroundColor: "rgba(170, 70, 70, 1)",
            borderRadius: "5px",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >Time Remaining: {`${Math.floor(time / 60)
          .toString()
          .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}
				`}</div>
        <div style={{ flexGrow: 1 }}></div>
        <ActionButton 
          text="Submit and Move On" 
          onClick={() => {}} 
          backcolor = "rgba(80, 180, 80, 1)"
        />
        <ActionButton
          text="Log out"
          onClick={() => {
            auth.signOut();
            navigate("/signup");
          }}
          backcolor= "rgba(0,0,0,0)"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "90%",
          width: "100%",
          position: "relative",
          top: "3%"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            margin: "1rem",
          }}
        >
          <div
            id="PuzzleBox"
            style={{
              width: "100%",
              height: "80%",
              marginBottom: "1rem",
              borderRadius: "5px",
              background: 
                "linear-gradient(180deg, rgba(170,170,170,1) 0%, rgba(243,243,243,1) 100%)",
            }}
          >
          {/** HERE IS WHERE THE GAME DISPLAYING TAKES PLACE */}
       
          <ReactFlow 
            nodes={initialNodes}
            edges={initialEdges} 
            panOnDrag = {true} 
            edgeTypes={edgeTypes} 
            nodeTypes = {nodeTypes}
            fitView
            /**TO DO: implement an 'on click' function for edges which makes the slider appear */

            >
            <Controls/>
            <Background variant= {BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
          {/** the following div covers up the React Flow logo */}
          <div style = {{position: "relative", bottom: "20px", left: "96%", background: "rgba(243,243,243,1)", width: "50px", height: "20px"}}></div>






          </div>
          <div
            id="InstructionBox"
            style={{
              width: "100%",
              borderRadius: "5px",
              background:
                "linear-gradient(180deg, rgba(135,219,255,1) 0%, rgba(204,243,255,1) 100%)",
              height: "20%",
            }}
          >
            <div
              id="InstructionText"
              style={{
                alignItems: "center",
                padding: "10px",
                height: "100%",
                width: "100%",
                textAlign: "center",
              }}
            >
              {collapseButton === "-" && (
                <h4>This time, the government have told you that their main priority is to connect two new government offices such that employees can go between the two in less than 2minutes. <br></br><br></br>
                  This is now your main priority. You are encouraged to think outside of the box to achieve it.  <br></br><br></br>
                  The solution you submit will be proposed to the Government. You should still aim to satisfy as many of the other demands as possible too.<br></br><br></br>
                </h4>
              )}
              {collapseButton === "+" && (
                <h1>Your first task is to find the instructions for this problem</h1>
              )}
            </div>

          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0
            }}
          >
            <ActionButton 
              text={collapseButton}
              onClick={toggleCollapse} 
            />
          </div>

        </div>
        <div
          id="ControlsBox"
          style={{
            width: "20%",
            margin: "1rem",
            borderRadius: "5px",
            background:
              "linear-gradient(180deg, rgba(135,219,255,1) 0%, rgba(204,243,255,1) 100%)",
          }}
        >
          <div 
            id="ControlText"
            style={{
              alignItems: "center",
              padding: "10px",
              textAlign: "center",
            }}
          >
          <h1>[Controls]</h1> <br></br>
          <h4>- Click on a road, and then use the slider to set how many people you want to send down it.</h4><br></br>
          <h4>- Click on a city for information on it.</h4><br></br>
          <h4>- Click submit when you think you have the maximum number of people reaching the target city.</h4></div>
          </div>
      </div>
    </MainWrapper>
  );
};

export default GamePage;
