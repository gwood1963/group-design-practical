import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import MainWrapper from "../components/ContentWrapper";

const GamePage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState<number>(0);
  let start = 0;
  useEffect(() => {
    start = Date.now() / 1000;
    const interval = setInterval(() => {
      setTime(Math.floor(Date.now() / 1000 - start));
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
          style={{
            margin: "1rem",
            padding: "0.5rem",
            color: "#DEF7FF",
            border: "2px solid #30BEFF",
            backgroundColor: "#87DBFF",
            borderRadius: "5px",
          }}
        >{`${Math.floor(time / 60)
          .toString()
          .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}
				`}</div>
        <div style={{ flexGrow: 1 }}></div>
        <ActionButton text="Submit and move on" onClick={() => {}} />
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
            style={{
              width: "100%",
              height: "80%",
              marginBottom: "1rem",
              borderRadius: "5px",
              background:
                "linear-gradient(180deg, rgba(135,219,255,1) 0%, rgba(204,243,255,1) 100%)",
            }}
          ></div>
          <div
            style={{
              width: "100%",
              borderRadius: "5px",
              background:
                "linear-gradient(180deg, rgba(135,219,255,1) 0%, rgba(204,243,255,1) 100%)",
              height: "20%",
            }}
          ></div>
        </div>
        <div
          style={{
            width: "20%",
            margin: "1rem",
            borderRadius: "5px",
            background:
              "linear-gradient(180deg, rgba(135,219,255,1) 0%, rgba(204,243,255,1) 100%)",
          }}
        ></div>
      </div>
    </MainWrapper>
  );
};

export default GamePage;
