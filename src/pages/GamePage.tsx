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
//import SliderEdge from '../components/SliderEdge';
import ImageNode from "../components/ImageNode";
import { Round1 } from "../game/Round1";
import NavBar from "../components/NavBar";
import InstructionsBox from "../components/InstructionsBox";
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

const GamePage = () => {
  //ON ANY PAGE WHERE YOU NEED INFORMATION ABOUT THE SIGNED IN USER, COPY AND PASTE THE FOLLOWING SECTION AT THE TOP
  //--------------------------------------------------------------------------------------------------------------
  //it will fetch the data of the currently signed in candidate, once when the page opens

  //GEORGE: use the following states varaibles to query the database. They will be of the signed in candidate. userId is unique.
  const [email, setEmail] = useState<string | null>("");
  const [fullName, setName] = useState<string | null>("");
  const [userId, setUserId] = useState<string>("");

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      //I think the useEffect here is needed to prevent infinite loops where the page re-renders, causing the emails and names to be set again, which causes another re-render  etc
      if (user) {
        setEmail(user.email);
        setName(user.displayName);
        setUserId(user.uid); //uniquely identifies users.
      }
    });
  }, []);

  //----------------------------------------------------------------------------------------------------------------------
  const navigate = useNavigate();
  const blueGradient =
    "linear-gradient(180deg, rgba(135,219,255,1) 0%, rgba(204,243,255,1) 100%)";
  const yellowGradient =
    "linear-gradient(180deg, rgba(255,245,156,1) 0%,   rgba(255, 253, 232,1) 100%)";
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

  useEffect(() => {
    const start = Date.now() / 1000;
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

  /**BELOW IS THE SET UP FOR THE PUZZLE DISPLAY */
  /** ---------------------------------------------------- */

  /** ---------- David's Addition, looks very weird compared to my console output */

  const onSubmit = () => {
    if (!round) return;
    console.log(round);
    console.log(flows);
    const score = round.getScoreFromArr(
      flows.map((f) => f.flow),
      round.getGraph()
    );
    console.log(score);
    fetch("/api/attempt", {
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
    });
    navigate("/game2");
  };

  useEffect(() => {
    (async () => {
      const round1 = new Round1();
      const seed = await fetch("/api/getproblem").then((res) => res.json());
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
  /* const initialNodes = [
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
  // const initialEdges = [
  //   {
  //     id: "e1-2",
  //     source: "1",
  //     target: "2",
  //     animated: true,
  //     type: "Round1Edge",
  //     data: {
  //       label: "5/12",
  //       flow: flow,
  //       flowFunc: setFlow,
  //       capacity: capacity,
  //     },
  //   },
  //   {
  //     id: "e2-4",
  //     source: "2",
  //     target: "4",
  //     animated: true,
  //     type: "Round1Edge",
  //     data: { label: "4/8" },
  //   },
  //   {
  //     id: "e4-6",
  //     source: "4",
  //     target: "6",
  //     animated: true,
  //     type: "Round1Edge",
  //     data: { label: "0/2" },
  //   },
  //   {
  //     id: "e4-7",
  //     source: "4",
  //     target: "7",
  //     animated: true,
  //     type: "Round1Edge",
  //     data: { label: "2/10" },
  //   },
  //   {
  //     id: "e6-7",
  //     source: "6",
  //     target: "7",
  //     animated: true,
  //     type: "Round1Edge",
  //     data: { label: "5/9" },
  //   },
  //   {
  //     id: "e5-7",
  //     source: "5",
  //     target: "7",
  //     animated: true,
  //     type: "Round1Edge",
  //     data: { label: "2/3" },
  //   },
  //   {
  //     id: "e2-5",
  //     source: "2",
  //     target: "5",
  //     animated: true,
  //     type: "Round1Edge",
  //     data: { label: "5/10" },
  //   },
  //   {
  //     id: "e1-3",
  //     source: "1",
  //     target: "3",
  //     animated: true,
  //     type: "Round1Edge",
  //     data: { label: "1/11" },
  //   },
  //   {
  //     id: "e3-5",
  //     source: "3",
  //     target: "5",
  //     animated: true,
  //     type: "Round1Edge",
  //     data: { label: "7/7" },
  //   },
  //   {
  //     id: "e5-7",
  //     source: "5",
  //     target: "7",
  //     animated: true,
  //     type: "Round1Edge",
  //     data: { label: "2/4" },
  //   },
  // ];

  const nodeTypes = React.useMemo(() => ({ ImageNode: ImageNode }), []);

  /**------------------------------------------------------------------------------------------------------------ */

  return (
    <MainWrapper flexDirection="column">
      <NavBar time={time} onSubmit={onSubmit} />
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
          <InstructionsBox content={instructionsContent} />
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
              One "road" is a segment connecting two buildings. <br />
              <br />
              <br />
              <b>Traffic limits:</b> where a road displays "5/10", for example,
              this indicates that the road has a limit of 10 people, and you are
              currently sending 5 people down it. <br />
              <br />
              <br />
              <b>To edit the number you are sending down a road: </b>click on
              the white box, and then use the slider. <br /> <br />
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
