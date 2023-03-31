import LinkButton from "../components/LinkButton";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import MainWrapper from "../components/ContentWrapper";
import Checkbox from "../components/Checkbox";

const SignupPage = () => {
  const navigate = useNavigate();

  const auth = getAuth();
  auth.useDeviceLanguage();
  const provider = new GoogleAuthProvider();

  const [error, setError] = useState<string | undefined>(undefined);

  return (
    <>
      <div className = "navBar">
        <LinkButton target="/" text="back button" image="/back.svg" backcolor = "rgba(0,0,0,0)"/>
        <ActionButton onClick= {() => {}} text = "Data Policy" backcolor = "rgba(0,0,0,0)" /> {/** Code to display data policy */}
      </div>
      <MainWrapper justifyContent="space-around">
        <div style = {{
          background: "white",
          boxShadow: "0 0 50px rgba(0, 0, 0, 0.2)",
          width: "50%",
          height: "60%",
          justifyContent: "left",
          flexDirection: "column",
          display: "flex",

        }}>
          
          <div className = "textbox" style = {{position: "relative", top: "30px", left: "30px", fontSize: "50px",}} >Sign up or log in</div>
          <div style = {{padding: "30px", fontSize: "14px", position: "relative", top: "40px", left: "10px"}}>
            <Checkbox/>  {/*TO DO:  implemenet features that sign up is only permitted once box checked*/ }
            I consent to my data being used in accordance with the Data Policy.
          </div>
          <div style = {{padding: "25px", fontSize: "14px", position: "relative", top: "20px"}}>
            <ActionButton
              onClick={(_) => {
                signInWithPopup(auth, provider)
                  .then((_) => {
                    navigate("/tokeninput");
                  })
                  .catch((error) => {
                    setError(`Error ${error.code} - ${error.message}`);
                  });
              }}
              text="Sign in with Google"
            />
          </div>
          
          
          {error !== undefined && <p>error</p>}
        </div>
      </MainWrapper>
    </>
  );
};

export default SignupPage;
