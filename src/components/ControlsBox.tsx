import { ReactNode } from "react";

type ControlBoxProps = {
  content: ReactNode;
};
const ControlsBox = ({ content }: ControlBoxProps) => {
  return (
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
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignContent: "center",
            height: "100%",
            fontSize: "20px",
            position: "relative",
            top: "40px",
          }}
        >
          {content}
        </text>
      </div>
    </div>
  );
};

export default ControlsBox;
