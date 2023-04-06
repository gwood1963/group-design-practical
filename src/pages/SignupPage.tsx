import LinkButton from "../components/LinkButton";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import MainWrapper from "../components/ContentWrapper";

const SignupPage = () => {
  const navigate = useNavigate();

  const auth = getAuth();
  auth.useDeviceLanguage();
  const provider = new GoogleAuthProvider();

  const [error, setError] = useState<string | undefined>(undefined);
  const [tos, setTos] = useState<boolean>(false);

  return (
    <>
      <div className="navBar">
        <LinkButton
          target="/"
          text="back button"
          image="/back.svg"
          backcolor="rgba(0,0,0,0)"
        />
        <ActionButton
          onClick={() => {}}
          text="Data Policy"
          backcolor="rgba(0,0,0,0)"
        />{" "}
        {/** Code to display data policy */}
      </div>
      <MainWrapper justifyContent="space-around">
        <div className="whitePopOut">
          <div
            className="textbox"
            style={{
              position: "relative",
              top: "30px",
              left: "30px",
              fontSize: "50px",
            }}
          >
            Sign up or log in
          </div>
          <div
            style={{
              padding: "30px",
              fontSize: "20px",
              position: "relative",
              top: "40px",
              left: "10px",
            }}
          >
            Please sign in or create an account to play. Your email will only be
            used to contact you for information and invitiations related to a
            career here at Microsoft. <br></br>
            <br></br>
            <input type="checkbox" onChange={(_) => setTos(!tos)} />I consent to
            my data being used in accordance with the Data Policy.
          </div>
          <div
            style={{
              padding: "25px",
              fontSize: "14px",
              position: "relative",
              top: "20px",
            }}
          >
            <ActionButton
              onClick={(_) => {
                if (!tos) {
                  setError(`You must accept the Data Policy to sign up!`);
                  return;
                }
                signInWithPopup(auth, provider)
                  .then((_) => {
                    navigate("/gamestart");
                  })
                  .catch((error) => {
                    setError(`Error ${error.code} - ${error.message}`);
                  });
              }}
              text="Sign in with Google"
            />
            {error !== undefined && (
              <p style={{ padding: "25px", fontSize: "16px", color: "red" }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </MainWrapper>
    </>
  );
};

export default SignupPage;
