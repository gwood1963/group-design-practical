import React, { ReactNode, useState } from "react";
import ActionButton from "./ActionButton";

const blueGradient =
  "linear-gradient(180deg, rgba(135,219,255,1) 0%, rgba(204,243,255,1) 100%)";
const yellowGradient =
  "linear-gradient(180deg, rgba(255,245,156,1) 0%,   rgba(255, 253, 232,1) 100%)";

type InstructionBoxProps = {
  content: ReactNode;
};

const InstructionsBox = ({ content }: InstructionBoxProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        id="InstructionBox"
        style={{
          width: "100%",
          borderRadius: "5px",
          background: open ? yellowGradient : blueGradient,
          height: open ? "50%" : "10%",
        }}
      >
        <div
          id="InstructionText"
          style={{
            alignItems: "center",
            padding: "5px",
            height: "100%",
            width: "100%",
            textAlign: "left",
          }}
        >
          {open ? (
            <div
              style={{
                fontSize: "18px",
                position: "relative",
                width: "100%",
              }}
            >
              {content}
            </div>
          ) : (
            <div
              style={{
                fontSize: "35px",
                position: "relative",
                top: "15%",
                left: "5%",
                color: "",
              }}
            >
              <i>Click [+] to view </i>
              <b>Instructions</b>{" "}
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          fontSize: "30px",
          width: "10px",
        }}
      >
        <ActionButton
          text={open ? "-" : "+"}
          onClick={() => setOpen((o) => !o)}
        />
      </div>
    </>
  );
};

export default InstructionsBox;
