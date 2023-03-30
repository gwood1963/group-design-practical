import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import MainWrapper from "../components/ContentWrapper";

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

  return (
    <MainWrapper flexDirection="column">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "10%",
        }}
      >
        <div
          id="Timer"
          style={{
            margin: "1rem",
            padding: "0.5rem",
            color: "#DEF7FF",
            border: "2px solid #30BEFF",
            backgroundColor: "#87DBFF",
            borderRadius: "5px",
          }}
        >Time Remaining: {`${Math.floor(time / 60)
          .toString()
          .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}
				`}</div>
        <div style={{ flexGrow: 1 }}></div>
        <ActionButton 
          text="Submit and move on" 
          onClick={() => {}} 
        />
        <ActionButton
          text="Log out"
          onClick={() => {
            auth.signOut();
            navigate("/signup");
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "90%",
          width: "100%",
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
          ></div>
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
