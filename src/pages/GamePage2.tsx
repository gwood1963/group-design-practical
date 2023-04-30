import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  ReactFlow,
  EdgeTypes,
  NodeTypes,
} from "reactflow";
import {
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import MainWrapper from "../components/ContentWrapper";
import ControlsBox from "../components/ControlsBox";
import ImageNode from "../components/ImageNode";
import InstructionsBox from "../components/InstructionsBox";
import NavBar from "../components/NavBar";
import Round1Edge from "../components/Round1Edge";
import Round2Edge from "../components/Round2Edge";
import { Round2 } from "../game/Round2";
import Modal from "react-modal";
import BuildRoadModal from "../components/BuildRoadModal";

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
      You have been given a budget to construct roads between offices, and you
      may construct as many roads as you would like, given you do not exceed
      your budget.
    </p>
    <p>
      Each road you construct will have a fixed capacity, and higher capacity
      roads will cost more
    </p>
    <p>
      She has asked you for your help. You need to{" "}
      <b>suggest which roads to build, and how best to spend the budget</b>, in
      order to get as many employees from the West to East Office as possible.
      Furthermore, on your route,{" "}
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
      To <b>create a road between two offices</b>, click on the first office,
      then the second office. This will display a popup showing the types of
      roads you may build, and the cost for each. Choose one of these to build
      the road.
    </p>
    <p>
      Click a road and the confirm delete button to <b>delete a road</b> and be
      refunded the cost of the road.
    </p>
    <p>
      <b> To submit your suggestion: </b>Click <i>Submit and Move On.</i>
    </p>
    <p>
      Remember you <b>must</b> submit before the timer runs out.
    </p>
  </>
);

const dummyNodes: Node[] = [
  {
    id: "0",
    zIndex: -1,
    type: "ImageNode",
    position: { x: 0, y: 50 },
    data: {
      label: "index 0",
      image: "/skyscraper.svg",
      color: "black",
    },
  },
  {
    id: "1",
    zIndex: -1,
    type: "ImageNode",
    position: { x: 250, y: 50 },
    data: {
      label: "index 1",
      image: "/skyscraper.svg",
      color: "black",
    },
  },
  {
    id: "2",
    zIndex: -1,
    type: "ImageNode",
    position: { x: 125, y: 100 },
    data: {
      label: "index 2",
      image: "/skyscraper.svg",
      color: "black",
    },
  },
  {
    id: "3",
    zIndex: -1,
    type: "ImageNode",
    position: { x: 125, y: 0 },
    data: {
      label: "index 3",
      image: "/skyscraper.svg",
      color: "black",
    },
  },
];

const dummyEdges: Edge[] = [];

const GamePage2 = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [time, setTime] = useState<number>(0);
  let start: number;

  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      Round2Edge: Round2Edge,
    }),
    []
  );
  const nodeTypes: NodeTypes = useMemo(() => ({ ImageNode: ImageNode }), []);

  // Start the timer
  useEffect(() => {
    start = Date.now() / 1000;
    setTime(3000);
    const interval = setInterval(() => {
      setTime(3000 - Math.floor(Date.now() / 1000 - start));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [nodes, setNodes] = useState<Node[]>(dummyNodes); //a state to store the array of nodes.
  const [edges, setEdges] = useState<Edge[]>([]); // a state to store the array of edges.
  const [flows, setFlows] = useState([{ id: "dummmy", flow: 5 }]); //Each edge is given an id. I intented to store flows as this array of id-flow pairs.

  const [budget, setBudget] = useState(1000);

  const [selectedNode, setSelectedNode] = useState<string[]>([]);
  const [buildRoadModal, setBuildRoadModal] = useState(false);

  const [round, setRound] = useState<Round2>();

  ////////////// sumbission stuffs
  const onSubmit = () => {
    if (!round) return;
    console.log(round);
    console.log(flows);
    const score = round.getScoreFromArr(
      flows.map((f) => f.flow),
      round.getGraph()
    );
    console.log(score);
    fetch("/api/attempt", { //TODO define "/api/attempt2"
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
    navigate("/goodbye");
  };
  /////////////////////

  /**BELOW IS THE SET UP FOR THE PUZZLE DISPLAY */
  /** ---------------------------------------------------- */
  useMemo(() => {
    (async () => {
      /*

      Copy and pasted from GamePage.tsx for round 1

      Things to change: 
      - Where are the seeds stored? in round 1 it was "/api/getproblem"
      - how to make edges? Idea: predraw all edges in both directions, but have them hidden
      - how to initialize money/budget? Probably use method Round2.moneyRemaining() 
      on initialization as its initial value is the value in bank
      - for scoring, use Round2.getScore() Note: score will be an integer
      - Also note, when we build/delete a road, the backend (round2 object) keeps track of it.
      To see the current money, use Round2.moneyRemaining()

      - database stuffs: store seeds, scores, etc. (George, should be similar to round 1)


      const round2 = new Round2();
      const seed = await fetch("/api/getproblem").then((res) => res.json());
      if (seed !== "NONE") {
        // read active problem from database
        round2.readSeed(seed);
        console.log("Problem loaded from database");
      } else {
        // generate new problem
        let added = false;
        while (!added) {
          // ensures we're not duplicating an existing problem
          round2.genRandom(6, 500, 300);
          const seed = round2.makeSeed();
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

      const nodeCount = round2.getN();

      let coords = round2.getCoords(); //gives the coordinates of the nodes

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

      //likely not needed for round 2

      // let flowsTemp = [];
      // let initialEdgesTemp: Edge[] = [];
      // for (let i = 0; i < nodeCount; i++) {
      //   for (let k = 0; k < adjacency[i].length; k++) {
      //     let j = adjacency[i][k][0];
      //     const myid = "e" + i + "-" + j;
      //     flowsTemp.push({ id: myid, flow: 0 }); //this is for initialising the flows arrey
      //     const capacity = String(adjacency[i][k][1]); //need to hook up to actual capacity array
      //     const temp = {
      //       id: myid,
      //       source: `${i}`,
      //       target: `${j}`,
      //       animated: true,
      //       type: "Round2Edge",
      //       zIndex: 0,
      //       data: {
      //         id: myid,
      //         getFlow: () =>
      //           flows.find((f) => f.id.localeCompare(myid))?.flow || 0,
      //         setFlow: setFlows,
      //         min: 0,
      //         capacity: capacity,
      //       },
      //     };
      //     initialEdgesTemp.push(temp);
      //   }
      // }
      setRound(round2);
    

      */
      let nodeCount = dummyNodes.length;
      let flowsTemp = [];
      let initialEdgesTemp: Edge[] = [];
      for (let i = 0; i < nodeCount; i++) {
        for (let k = 0; k < nodeCount; k++) {
          if (i !== k && i < k) {
            const myid = "e" + i + "-" + k;
            flowsTemp.push({ id: myid, flow: 0 }); //this is for initialising the flows arrey
            const capacity = 10;
            const temp = {
              id: myid,
              source: `${i}`,
              target: `${k}`,
              animated: true,
              type: "Round2Edge",
              zIndex: 0,
              data: {
                id: myid,
                getFlow: () =>
                  flows.find((f) => f.id.localeCompare(myid))?.flow || 0,
                setFlow: setFlows,
                min: -capacity,
                capacity: capacity,
                visible: false,
              },
            };
            initialEdgesTemp.push(temp);
          }
        }
      }
      setFlows(flowsTemp);
      setEdges(initialEdgesTemp);
    })();
  }, []);

  const selectNode = (_: React.MouseEvent, n: Node) => {
    if (selectedNode.length === 0) {
      // First node
      setSelectedNode([n.id]);
      return;
    } else if (selectedNode.includes(n.id)) {
      return;
    }
    console.log(selectedNode);
    const edge = edges.find(
      (e) =>
        (e.source === selectedNode[0] && e.target === n.id) ||
        (e.source === n.id && e.target === selectedNode[0])
    );
    console.log(edge);
    if (edge && edge.data.visible) {
      // delete road that already exists
      setEdges((es) =>
        es.map((e) =>
          e.id === edge.id ? { ...e, data: { ...e.data, visible: false } } : e
        )
      );
      setBudget((b) => b + edge.data.capacity * 10);
      setSelectedNode([]);
    } else {
      // open road modal if it doesnt
      setSelectedNode((ns) => [...ns, n.id]);
      setBuildRoadModal(true);
    }
  };

  const buildRoad = (capacity: number) => {
    if (budget - capacity * 10 < 0) {
      return;
    }
    setEdges((es) =>
      es.map((e) =>
        e.id === `e${selectedNode[0]}-${selectedNode[1]}` ||
        e.id === `e${selectedNode[1]}-${selectedNode[0]}`
          ? {
              ...e,
              data: {
                ...e.data,
                visible: !e.data.visible,
                capacity: capacity,
                min: -capacity,
              },
            }
          : e
      )
    ); // toggles visiblity for the selected edge.
    setBuildRoadModal(false);
    setSelectedNode([]);
    setBudget((b) => b - capacity * 10);
  };

  return (
    <MainWrapper flexDirection="column">
      <NavBar
        time={time}
        onSubmit={onSubmit}
        subtitle={`Money remaining: $${budget}`}
      />
      <Modal
        isOpen={buildRoadModal}
        ariaHideApp={false}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "linear-gradient(180deg, rgba(170,170,170,1) 0%, rgba(243,243,243,1) 100%)",
            height: "300px",
            width: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.4)",
          },
        }}
      >
        <BuildRoadModal submit={buildRoad} budget={budget} />
      </Modal>
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
              edgeTypes={edgeTypes}
              nodeTypes={nodeTypes}
              onNodeClick={selectNode}
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

export default GamePage2;
