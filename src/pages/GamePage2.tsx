import { Background, BackgroundVariant, Controls, ReactFlow } from "reactflow";
import MainWrapper from "../components/ContentWrapper";
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

const GamePage2 = () => {
  return (
    <MainWrapper flexDirection="column">
      <NavBar time={0} onSubmit={() => {}} />
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
              nodes={[]}
              edges={[]}
              panOnDrag={true}
              edgeTypes={undefined}
              nodeTypes={undefined}
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

export default GamePage2;
