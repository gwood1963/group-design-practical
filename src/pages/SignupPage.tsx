import LinkButton from "../components/LinkButton";
import {
  AuthProvider,
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import MainWrapper from "../components/ContentWrapper";
import ImageActionButton from "../components/ImageActionButton";

const SignupPage = () => {
  const navigate = useNavigate();

  const auth = getAuth();
  auth.useDeviceLanguage();
  const googleProvider = new GoogleAuthProvider();
  const microsoftProvider = new OAuthProvider("microsoft.com");

  const [error, setError] = useState<string | undefined>(undefined);
  const [tos, setTos] = useState<boolean>(false);

  const handleSignup = (provider: AuthProvider) => {
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
  };

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
          onClick={() => {
            var datapolicy = document.getElementById("DataPolicy")!;
            datapolicy?.classList.toggle("show");
          }}
          text="Data Policy"
          backcolor="rgba(0,0,0,0)"
        />{" "}
        {/** Code to display data policy */}
      </div>
      <MainWrapper justifyContent="space-around">
        


        <div className="whitePopOut" style ={{position: "absolute", top: "20%", left: "25%"}}>
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
              onClick={(_) => handleSignup(microsoftProvider)}
              text="Sign in with Microsoft"
            />
            <ActionButton
              onClick={(_) => handleSignup(googleProvider)}
              text="Sign in with Google"
            />
            {error !== undefined && (
              <p style={{ padding: "25px", fontSize: "16px", color: "red" }}>
                {error}
              </p>
            )}
          </div>
        </div>
        <div id = "DataPolicy" className = "whitePopOut" >
          <div style = {{position: "relative", left: "92%"}}>
            <ImageActionButton image = "/close.svg" text = "Close" onClick = {() => {var datapolicy = document.getElementById("DataPolicy")!; datapolicy?.classList.toggle("show");}}/>
          </div>
          <div className = "textbox" style ={{position: "relative", width: "100%", height: "80"}}></div>
        </div>
      </MainWrapper>
    </>
  );
};

export default SignupPage;
