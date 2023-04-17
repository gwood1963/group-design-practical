import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  ReactFlow,
} from "reactflow";
import MainWrapper from "../components/ContentWrapper";
import ControlsBox from "../components/ControlsBox";
import ImageNode from "../components/ImageNode";
import InstructionsBox from "../components/InstructionsBox";
import NavBar from "../components/NavBar";

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
    id: "1",
    zIndex: -1,
    type: "ImageNode",
    position: { x: 0, y: 50 },
    data: {
      label: "West Office",
      image: "/skyscraper.svg",
      color: "black",
    },
  },
  {
    id: "2",
    zIndex: -1,
    type: "ImageNode",
    position: { x: 250, y: 50 },
    data: {
      label: "East Office",
      image: "/skyscraper.svg",
      color: "black",
    },
  },
];

const dummyEdges: Edge[] = [

]

const GamePage2 = () => {
  return (
    <MainWrapper flexDirection="column">
      <NavBar
        time={0}
        onSubmit={() => {}}
        subtitle="You must stay within budget"
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
              nodes={dummyNodes}
              edges={[]}
              panOnDrag={true}
              edgeTypes={undefined}
              nodeTypes={{ ImageNode: ImageNode }}
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
