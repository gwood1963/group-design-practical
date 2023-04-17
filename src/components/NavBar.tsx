import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ActionButton from "./ActionButton";

type NavBarProps = {
  time: number;
  onSubmit: () => void;
subtitle?: string;
};

const NavBar = ({ time, onSubmit, subtitle }: NavBarProps) => {
  const auth = getAuth();
  const navigate = useNavigate();

  return (
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "left",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "35px", color: "white" }}>
          Get as many people from West to East as possible.
        </div>
        <div style={{ fontSize: "18px", color: "white", position: "relative" }}>
					{subtitle}
        </div>
      </div>
      <div style={{ flexGrow: 1 }}></div>
      <ActionButton
        text="Submit and Move On"
        onClick={onSubmit}
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
  );
};

export default NavBar;
