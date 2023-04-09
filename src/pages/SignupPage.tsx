import LinkButton from "../components/LinkButton";
import {
  AuthProvider,
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
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
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result); //gives access to the Google API
        const token = credential?.accessToken;
        const user = result.user;
        const email = user.email;  //these aren't actually used in thise page. See the start of GamePage and GameStartPage for how to access these values if you do need them
        const fullName = user.displayName;
        const userID = user.uid;
        fetch('/api/register', { // add user to database if not already present
          method: 'PUT',
          body: JSON.stringify({
            email: email,
            name: fullName
          }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        
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
          <div className = "textbox" style ={{position: "relative", width: "100%", height: "80", margin: "50px", fontSize: "14px", overflow: "auto"}}>
            <p><h1><u>Privacy Policy</u></h1>
            Group 12’s Privacy Policy as of 23/03/2023 </p>
          
            <p><u><b>Our contact details</b></u> <br></br>
            Miranda Conn<br></br>
            miranda.conn@some.ox.ac.uk </p>
           
            <p><u><b>The type of personal information we collect </b></u><br></br>
            We currently collect and process the following information: <br></br>
            <li>Your first name and surname </li>
            <li>Your email address </li>
            <li>Your performance on our game </li></p>
          
            <p><u><b>How we get the personal information and why we have it</b></u> <br></br>
            Most of the personal information we process is provided to us directly by you for the following reasons:<br></br>
            <li>To identify yourself to us as a candidate, in order to be considered for a position at Microsoft.</li>
            We use the information that you have given us in order to:
            <li>Assess your skill as a potential employee at Microsoft.</li>
            <li>Communicate with you regarding your application.</li>
            <li>We may share this information with employees within our organisation specifically tasked with processing your job application.</li></p>
            <p>Under the UK General Data Protection Regulation (UK GDPR), the lawful bases we rely on for processing this information are:
            <li>(a) Your consent. You are able to remove your consent at any time. You can do this by contacting <b>miranda.conn@some.ox.ac.uk</b> </li>
            <li>(b) We have a contractual obligation.</li>
            <li>(e) We need it to perform a public task. </li></p>
    
            <p><u><b>How we store your personal information</b></u> <br></br> 
            Your information is securely stored using Azure’s security measures. 
            <br/> We keep your contact details and test data for as long as your application with us is active. <br/> We will then dispose your information by erasing it completely from our databases.</p>
          
            <p>By proceeding, you indicate that you agree to the terms of our privacy policy.</p>

          </div>
        </div>
      </MainWrapper>
    </>
  );
};

export default SignupPage;
