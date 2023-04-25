import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  ReactFlow,
  EdgeTypes,
} from "reactflow";
import {
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";
import MainWrapper from "../components/ContentWrapper";
import ControlsBox from "../components/ControlsBox";
import ImageNode from "../components/ImageNode";
import InstructionsBox from "../components/InstructionsBox";
import NavBar from "../components/NavBar";
import Round1Edge from "../components/Round1Edge";
import Round2Edge from "../components/Round2Edge";
import Modal from "react-modal";
import BuildRoadModal from "../components/BuildRoadModal";

const edgeTypes: EdgeTypes = {
  Round2Edge: Round2Edge,
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
  const [nodes, setNodes] = useState<Node[]>(dummyNodes); //a state to store the array of nodes.
  const [edges, setEdges] = useState<Edge[]>([]); // a state to store the array of edges.
  const [flows, setFlows] = useState([{ id: "dummmy", flow: 5 }]); //Each edge is given an id. I intented to store flows as this array of id-flow pairs.

  const [budget, setBudget] = useState(5000);

  const [selectedNode, setSelectedNode] = useState<string[]>([]);
  const [buildRoadModal, setBuildRoadModal] = useState(false);

  /**BELOW IS THE SET UP FOR THE PUZZLE DISPLAY */
  /** ---------------------------------------------------- */
  useMemo(() => {
    (async () => {
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
            console.log(temp);
          }
        }
      }
      setFlows(flowsTemp);
      setEdges(initialEdgesTemp);
      console.log("initialEdgesTemp", initialEdgesTemp);
      console.log("edges", edges);
    })();
  }, []);

  const selectNode = (_: React.MouseEvent, n: Node) => {
    console.log(selectedNode);
    if (selectedNode.length === 0) {
      setSelectedNode([n.id]);
    } else if (selectedNode.includes(n.id)) {
    } else {
      setSelectedNode((ns) => [...ns, n.id]);
      setBuildRoadModal(true);
    }
  };

  const buildRoad = (capacity: number) => {
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
        time={0}
        onSubmit={() => {}}
        subtitle="You must stay within budget"
      />
      <Modal
        isOpen={buildRoadModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "linear-gradient(180deg, rgba(170,170,170,1) 0%, rgba(243,243,243,1) 100%)",
            height: "200px",
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
        <BuildRoadModal submit={buildRoad} />
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
              nodeTypes={{ ImageNode: ImageNode }}
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
