import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import MainWrapper from "../components/ContentWrapper";
import ReactFlow, { Edge, Node } from "reactflow";
import "reactflow/dist/style.css";
import React from "react";
import { Controls, Background, EdgeTypes, BackgroundVariant } from "reactflow";
import Round1Edge from "../components/Round1Edge";
import ImageNode from "../components/ImageNode";
import { Round1 } from "../game/Round1";
import NavBar from "../components/NavBar";
import InstructionsBox from "../components/InstructionsBox";
import ControlsBox from "../components/ControlsBox";
const edgeTypes: EdgeTypes = {
  Round1Edge: Round1Edge,
};

const instructionsContent = (
  <div style={{ margin: "0.5rem" }}>
    <p>
      <b>A company owner has two offices in this city. </b>
      Currently all of her employees are in the West Office. She needs to move{" "}
      <b>
        as many employees as possible to the East Office within the next 10
        minutes
      </b>{" "}
      for a conference.
    </p>
    <p>
      Unfortunately, the City Council has imposed some{" "}
      <b>strict traffic restrictions</b>, limiting the number of people the
      company is to allowed to send down any given road in the city within a 10
      minute period.
    </p>
    <p>
      She has asked you for your help. You need to{" "}
      <b>suggest how many people she sends down each road</b>, in order to get
      as many employees from the West to East Office as possible, without
      breaking the traffic restrictions. Furthermore, on your route,{" "}
      <b>the same number of people must leave any building as enter it</b>.
    </p>
    <p>
      When you think your suggestion gets as many people to the East Office as
      possible, press{" "}
      <i>
        <b>Submit and Move On.</b>
      </i>
    </p>
    <br />
  </div>
);

const controlsContent = (
  <>
    <p>One "road" is a segment connecting two buildings.</p>
    <p>
      <b>Traffic limits:</b> where a road displays "5/10", for example, this
      indicates that the road has a limit of 10 people, and you are currently
      sending 5 people down it.
    </p>
    <p>
      <b>To edit the number you are sending down a road: </b>click on the white
      box, and then use the slider.
    </p>
    <p>
      <b> To submit your suggestion: </b>Click <i>Submit and Move On.</i>
    </p>
    <p>
      Remember you <b>must</b> submit before the timer runs out.
    </p>
  </>
);

const GamePage = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [time, setTime] = useState<number>(0);
  let start: number;

  // Start the timer
  useEffect(() => {
    start = Date.now() / 1000;
    setTime(3000);
    const interval = setInterval(() => {
      setTime(3000 - Math.floor(Date.now() / 1000 - start));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Game State
  const [flows, setFlows] = useState([{ id: "dummmy", flow: 5 }]); //Each edge is given an id. I intented to store flows as this array of id-flow pairs.
  const [nodes, setNodes] = useState<Node[]>([]); //a state to store the array of nodes.
  const [edges, setEdges] = useState<Edge[]>([]); // a state to store the array of edges.
  const [round, setRound] = useState<Round1>();

  const onSubmit = async () => {
    if (!round) return;
    console.log(round);
    console.log(flows);
    const score = round.getScoreFromArr(
      flows.map((f) => f.flow),
      round.getGraph()
    );
    console.log(score);
    const id = await fetch("/api/attempt", {
      method: "POST",
      body: JSON.stringify({
        score: score,
        uid: auth.currentUser?.uid,
        seed: round.makeSeed(),
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(res => res.json());
    navigate("/game2", {state: id});
  };

  /**BELOW IS THE SET UP FOR THE PUZZLE DISPLAY */
  /** ---------------------------------------------------- */
  useEffect(() => {
    (async () => {
      const round1 = new Round1();
      const seed = await fetch("/api/getproblem/1").then((res) => res.json());
      if (seed !== "NONE") {
        // read active problem from database
        round1.readSeed(seed);
        console.log("Problem loaded from database");
      } else {
        // generate new problem
        let added = false;
        while (!added) {
          // ensures we're not duplicating an existing problem
          round1.genRandom(5, 3, 2, 2, 5, 10);
          const seed = round1.makeSeed();
          console.log(seed);
          added = await fetch("/api/addproblem", {
            method: "PUT",
            body: JSON.stringify({
              seed: seed,
              round: 1
            }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }).then((res) => res.json());
        }
        console.log("New problem generated.");
      }

      let nodesTemp = [];

      const adjacency = round1.getA();
      // const ANoCap = round1.getANoCap();

      const nodeCount = round1.getN();

      let coords = round1.getCoords(500, 300); //gives the coordinates of the nodes

      // Generate nodes
      for (let i = 0; i < nodeCount; i++) {
        var myLabel = "";
        var myColor = "black";
        if (i == 0) {
          myLabel = "West Office, 60";
          myColor = "green";
        } else if (i == nodeCount - 1) {
          myLabel = "East Office";
          myColor = "red";
        }

        var myImage = "/building2trees.svg";
        var randomImage = Math.random();
        if (randomImage > 0.6666) {
          myImage = "/skyscraper.svg";
        } else if (randomImage > 0.45) {
          myImage = "/factory.svg";
        } else if (randomImage > 0.333) {
          myImage = "/church.svg";
        }

        const node = {
          id: `${i}`,
          zIndex: -1, //in front of edges but behind labels
          type: "ImageNode",
          position: { x: coords[i][0], y: coords[i][1] },
          data: {
            label: myLabel,
            image: myImage,
            color: myColor,
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
            zIndex: 0,
            data: {
              id: myid,
              getFlow: () =>
                flows.find((f) => f.id.localeCompare(myid))?.flow || 0,
              setFlow: setFlows,
              min: 0,
              capacity: capacity,
            },
          };
          initialEdgesTemp.push(temp);
        }
      }
      setRound(round1);
      setFlows(flowsTemp);
      setEdges(initialEdgesTemp);
    })();
  }, []);

  const nodeTypes = React.useMemo(() => ({ ImageNode: ImageNode }), []);

  return (
    <MainWrapper flexDirection="column">
      <NavBar
        time={time}
        onSubmit={onSubmit}
        subtitle="You must obey the traffic restrictions"
      />
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
          <InstructionsBox content={instructionsContent} />
        </div>
        <ControlsBox content={controlsContent} />
      </div>
    </MainWrapper>
  );
};

export default GamePage;
