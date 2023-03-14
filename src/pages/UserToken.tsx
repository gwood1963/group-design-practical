import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import MainWrapper from "../components/ContentWrapper";
import LinkButton from "../components/LinkButton";

const UserTokenPage = () => {
  const [token, setToken] = useState<string>();
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  return (
    <>
      <LinkButton target="/" text="back button" image="/back.svg" />
      <MainWrapper flexDirection="column">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ color: "#0089C4", padding: "0.5rem 2rem" }}>
            Enter a puzzle token:
          </label>
          <input
            style={{
              border: "2px solid #30BEFF",
              borderRadius: "100px",
              padding: "0.5rem",
            }}
            placeholder="token"
            onChange={(e) => setToken(e.target.value)}
            value={token}
          />
        </div>
        <ActionButton
          text="Submit"
          onClick={(_) => {
            // TODO compare to database tokens.
            if (token && token.length === 10 && parseInt(token, 16)) {
              navigate(`/game?token=${token}`);
            } else {
              setError("Not a valid token!");
            }
          }}
        />
        {error && <p style={{ color: "#FF5C77" }}>{error}</p>}
      </MainWrapper>
    </>
  );
};

export default UserTokenPage;
