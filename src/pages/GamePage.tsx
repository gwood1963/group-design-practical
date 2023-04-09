import { getAuth } from "firebase/auth";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import MainWrapper from "../components/ContentWrapper";
import ReactFlow, { Edge, Node } from "reactflow";
import "reactflow/dist/style.css";
import React from "react";
import { Controls, Background, EdgeTypes, BackgroundVariant } from "reactflow";
import Round1Edge from "../components/Round1Edge";
//import SliderEdge from '../components/SliderEdge';
import ImageNode from "../components/ImageNode";

import { Round1 } from "../game/Round1";
const edgeTypes: EdgeTypes = {
  Round1Edge: Round1Edge,
};

const blueGradient =
  "linear-gradient(180deg, rgba(135,219,255,1) 0%, rgba(204,243,255,1) 100%)";
const yellowGradient =
  "linear-gradient(180deg, rgba(255,245,156,1) 0%,   rgba(255, 253, 232,1) 100%)";

const GamePage = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  // UI State
  const [time, setTime] = useState<number>(0);
  const [collapseButton, collapseState] = useState("+");
  const [instructBoxSize, setBoxSize] = useState("10%");
  const [instructBoxColor, setBoxColor] = useState(blueGradient);

  const toggleCollapse = () => {
    collapseState((state) => (state === "-" ? "+" : "-"));
    setBoxSize((state) => (state === "10%" ? "50%" : "10%"));
    setBoxColor((state) =>
      state === blueGradient ? yellowGradient : blueGradient
    );
  };

  // Game State
  const [flows, setFlows] = useState([{ id: "dummmy", flow: 5 }]); //Each edge is given an id. I intented to store flows as this array of id-flow pairs.
  const [nodes, setNodes] = useState<Node[]>([]); //a state to store the array of nodes.
  const [edges, setEdges] = useState<Edge[]>([]); // a state to store the array of edges.

  //IDEA: function below should map over the array of flows until it finds the entry matching thisid. It then returns the flow associated with this entry.
  // function findFlow(thisid: String) {
  //   return flows
  //     .filter((edge) => {
  //       return edge.id == thisid;
  //     })
  //     .map((edge) => edge.flow)[0];
  // }

  //DELETE?: The lines below were originally used to regenerate a new graph every 20s when david was testing. So you can likely delete it now but I leave it here in case you need something similar.
  let start = 0;
  // useEffect(() => {
  //   start = Date.now() / 1000;
  //   const interval = setInterval(() => {
  //     setTime(3000 - Math.floor(Date.now() / 1000 - start));
  //   }, 20000);

  //   return () => clearInterval(interval);
  // }, []);

  /**BELOW IS THE SET UP FOR THE PUZZLE DISPLAY */
  /** ---------------------------------------------------- */

  //IDEA: If you use a useMemo or useEffect, with a function as the first paramter, and a [] as the second paramter, then the code in it should only run once when the page first loads
  //the second paramter is the list of React States which it 'watches' -- it will re-render if any of them change

  //IDEA: whilst the nodes only need to be rendered once, we will need to re-render the edges every time the flows change if we want to update the labels.
  // So I have tried to put it in a useEffect with second paramater [flows], hoping that it would update only when flows changes
  // I think this is the right strategy, however I am running into a problem where for some reason it is re-rendering infinitely often, as though flows is constantly being changed
  // see the console log to see how many times "re-rendering edges is called"
  // Maybe it's stuck in an infinite loop because I call setFlows at the end of the funciton, meaning as soon as the function is finished it then calls itself again because flows changes
  // ^^Thinking about it -- thats definitely the problem.
  // ^^Might be solveable by having two different useEffects: one which just runs on start up, in which we initialise all the flows to 0 as below and use setFlows  ...
  // and a separate one which watches flows and purely updates the labels of the edges if flows changes (without calling setFlows inside the function)

  useEffect(() => {
    let nodesTemp = [];

    const round1 = new Round1();
    round1.genRandom();

    round1.getGraph(); //this is where the graph is actually generated
    const adjacency = round1.getA();
    // const ANoCap = round1.getANoCap();

    const nodeCount = round1.getN();

    let coords = round1.getCoords(500, 300); //gives the coordinates of the nodes

    // Generate nodes
    for (let i = 0; i < nodeCount; i++) {
      const node = {
        id: `${i}`,
        type: "ImageNode",
        position: { x: coords[i][0], y: coords[i][1] },
        data: {
          label: "",
          image: "/church.svg",
          color: "black",
        },
      };
      nodesTemp.push(node);
    }
    setNodes(nodesTemp);

    let flowsTemp = [];
    let initialEdgesTemp: Edge[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let k = 0; k < adjacency[i].length; k++) {
        let j = adjacency[i][k][0];
        const myid = "e" + i + "-" + j;
        flowsTemp.push({ id: myid, flow: 0 }); //this is for initialising the flows arrey
        const capacity = String(adjacency[i][k][1]); //need to hook up to actual capacity array
        const temp = {
          id: myid,
          source: `${i}`,
          target: `${j}`,
          animated: true,
          type: "Round1Edge",
          data: {
            id: myid,
            getFlow: () => (
              flows.find((f) => f.id.localeCompare(myid))?.flow || 0
            ),
            setFlow: setFlows,
            capacity: capacity,
          },
        };
        initialEdgesTemp.push(temp);
      }
    }
    setFlows(flowsTemp);
    setEdges(initialEdgesTemp);
  }, []);

  console.log(flows);
  /*
  //@ts-ignore
  //const nodes = nodesTemp;
  console.log("Here are initial nodes")
  console.log(nodesTemp)
  //@ts-ignore
  //const initialEdges = initialEdgesTemp;
  console.log("HERE ARE FLOWS")
  console.log(flows)
  console.log("Here are initial nodes")
  console.log(nodes)*/

  //useEffect(() => {
  //  console.log("re-rendering");
  //  let flowsTemp = [];
  //  let initialEdgesTemp = [];
  //  for (let i = 0; i < num; i++) {
  //    for (let k = 0; k < adjacency[i].length; k++) {
  //      let j = adjacency[i][k][0];
  //      const myid = "e" + i + "-" + j;
  //      //@ts-ignore

  //      flowsTemp.push({ id: myid, flow: 0 }); //this is for initialising the flows arrey
  //      const capacity = String(adjacency[i][k][1]); //need to hook up to actual capacity array
  //      const temp = {
  //        id: myid,
  //        source: "" + i,
  //        target: "" + j,
  //        animated: true,
  //        type: "Round1Edge",
  //        data: {
  //          ID: myid,
  //          //@ts-ignore
  //          Label: String(findFlow()) + adjacency[i][k][1], //problem -- I'm not sure that findFlow is actually working as we hope here.  HOWEVER, I think it might work once we separate out the cases of initialisation and updating (as per my comment paragraph above, s.t. we only use findFlows when we are updating labels, because then there will actually be something in the flows array to fetch)
  //          //@ts-ignore
  //          flow: findFlow(),
  //          //@ts-ignore
  //          //flowFunc: setFlows,
  //          capacity: capacity,
  //          allFlows: flows, //thought this might be useful to access from the slider function
  //        },
  //      };
  //      initialEdgesTemp.push(temp);
  //    }
  //  }
  //  setEdges(initialEdgesTemp);
  //}, []);

  /** ---------------------------------------------------------------------- */

  /**TO DO: the x and y coordinates need to be taken from an array. */
  function scalex(x: number) {
    return x * 12.5;
  } /**These scale functions are likely now redundant as I have worked out there is a fitView function. However they are left here in case we still need to convert David's position output into coordinates. */
  function scaley(y: number) {
    return y * 6.5;
  }
  /* const nodes = [
  { id: '1', type: "ImageNode", position: { x: scalex(10) , y: scaley(50) }, data: { label: 'West Office', image: "/building2trees.svg", color: "green"} },
  { id: '2', type: "ImageNode", position: { x: scalex(20), y: scaley(30) }, data: { label: '', image: "/church.svg" ,color: "black" } },
  { id: '3', type: "ImageNode",position: { x: scalex(20), y: scaley(80) }, data: { label: '' , image: "/skyscraper.svg", color: "black" } },
  { id: '4', type: "ImageNode",position: { x: scalex(50), y: scaley(40) }, data: { label: '', image: "/building2trees.svg", color: "black"  } },
  {id: '5', type: "ImageNode",position: { x: scalex(60), y: scaley(60) }, data: { label: '' , image: "/factory.svg", color: "black" } },
  {id: '6', type: "ImageNode",position: { x: scalex(70), y: scaley(20) }, data: { label: '' , image: "/skyscraper.svg", color: "black" } },
  {id: '7', type: "ImageNode", position: { x: scalex(80), y: scaley(50) }, data: { label: 'East Office', image: "/building2trees.svg", color: "red"  } },
]; */
  /**TO DO: add a label to the start node which says how many people need to get accross.  */

  /**TO DO: The data labels in the edges below need to be taken from the live flow (stored in an array?) and the capacities from the array of capacities */
  /**TO DO: implement that the source and targets are taken from the adjacency list generated */
  /*const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, type: "Round1Edge", data: {label: '5/12', flow: flow, flowFunc: setFlow, capacity: capacity}},
  { id: 'e2-4', source: '2', target: '4', animated: true, type: "Round1Edge", data: {label: '4/8'}},
  { id: 'e4-6', source: '4', target: '6', animated: true, type: "Round1Edge", data: {label: '0/2'}},
  { id: 'e4-7', source: '4', target: '7', animated: true, type: "Round1Edge", data: {label: '2/10'}},
  { id: 'e6-7', source: '6', target: '7', animated: true, type: "Round1Edge", data: {label: '5/9'}},
  { id: 'e5-7', source: '5', target: '7', animated: true, type: "Round1Edge", data: {label: '2/3'}},
  { id: 'e2-5', source: '2', target: '5', animated: true, type: "Round1Edge", data: {label: '5/10'}},
  { id: 'e1-3', source: '1', target: '3', animated: true, type: "Round1Edge", data: {label: '1/11'}},
  { id: 'e3-5', source: '3', target: '5', animated: true, type: "Round1Edge", data: {label: '7/7'}},
  { id: 'e5-7', source: '5', target: '7', animated: true, type: "Round1Edge", data: {label: '2/4'}},
];*/

  const nodeTypes = React.useMemo(() => ({ ImageNode: ImageNode }), []);

  /**------------------------------------------------------------------------------------------------------------ */

  return (
    <MainWrapper flexDirection="column">
      <div className="navBar">
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
        >
          Time Remaining:{" "}
          {`${Math.floor(time / 60)
            .toString()
            .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}
				`}
        </div>
        <div style={{ flexGrow: 1 }}></div>
        <ActionButton
          text="Submit and Move On"
          onClick={() => {}}
          backcolor="rgba(80, 180, 80, 1)"
        />
        <ActionButton
          text="Log out"
          onClick={() => {
            auth.signOut();
            navigate("/signup");
          }}
          backcolor="rgba(0,0,0,0)"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "90%",
          width: "100%",
          position: "relative",
          top: "3%",
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
              height: "90%",
              marginBottom: "1rem",
              borderRadius: "5px",
              background:
                "linear-gradient(180deg, rgba(170,170,170,1) 0%, rgba(243,243,243,1) 100%)",
            }}
          >
            {/** HERE IS WHERE THE GAME DISPLAYING TAKES PLACE */}

            <ReactFlow
              nodes={nodes}
              edges={edges}
              panOnDrag={true}
              edgeTypes={edgeTypes}
              nodeTypes={nodeTypes}
              fitView
            >
              <Controls />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </div>
          <div
            id="InstructionBox"
            style={{
              width: "100%",
              borderRadius: "5px",
              background: instructBoxColor,
              height: instructBoxSize,
            }}
          >
            <div
              id="InstructionText"
              style={{
                alignItems: "center",
                padding: "5px",
                height: "100%",
                width: "100%",
                textAlign: "left",
              }}
            >
              {collapseButton === "-" && (
                <div
                  style={{
                    fontSize: "18px",
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <b>A company owner has two offices in this city. </b>{" "}
                  Currently all of her employees are in the West Office. <br />
                  However, she needs to move{" "}
                  <b>
                    as many employees as possible to the East Office within the
                    next 10 minutes{" "}
                  </b>{" "}
                  for a conference.
                  <br /> <br />
                  Unfontunatly, the City Council has imposed some{" "}
                  <b>strict traffic restrictions</b>, limiting the number of
                  people the company is to allowed to send down any <br /> given
                  road in the city within a 10 minute period. <br />
                  <br />
                  She has asked you for your help. You need to{" "}
                  <b>
                    suggest how many people she sends down each road, in order
                    to get as many emploeyees from the
                    <br /> West to East Office as possible, without breaking the
                    traffic restrictions.
                  </b>{" "}
                  <br />
                  <br />
                  When you think your suggestion gets as many people to the East
                  Office as possible, press{" "}
                  <i>
                    <b>Submit and Move On.</b>
                  </i>
                </div>
              )}
              {collapseButton === "+" && (
                <div
                  style={{
                    fontSize: "35px",
                    position: "relative",
                    top: "15%",
                    left: "5%",
                    color: "",
                  }}
                >
                  <i>Click [+] to view </i>
                  <b>Instructions</b>{" "}
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
            }}
          >
            <ActionButton text={collapseButton} onClick={toggleCollapse} />
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
            <text style={{ fontSize: "50px", padding: "30px" }}>Controls </text>
            <text
              style={{
                textAlign: "center",
                fontSize: "20px",
                position: "relative",
                top: "40px",
              }}
            >
              <br />
              <b>Traffic limits:</b> where a road displays "5/10", for example,
              this indicates that the road has a limit of 10 people, and you are
              currently sending 5 people down it. <br />
              <br />
              <br />
              <b>To edit the number you are sending down a road: </b>click on
              the road, and then use the slider. <br /> <br />
              <br />
              <b> To submit your suggestion: </b>Click{" "}
              <i>Submit and Move On.</i>
              <br /> <br />
              <br />
              Remember you <b>must</b> submit before the timer runs out.
            </text>
          </div>
        </div>
      </div>
    </MainWrapper>
  );
};

export default GamePage;
