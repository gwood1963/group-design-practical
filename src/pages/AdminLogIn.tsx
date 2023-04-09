import MainWrapper from "../components/ContentWrapper";
import LinkButton from "../components/LinkButton";
import {
  AuthProvider,
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import {useImperativeHandle, useState} from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import ImageActionButton from "../components/ImageActionButton";

const AdminLogIn = () => {
  const navigate = useNavigate();
  //Admin sign in 
  //--------------------------------------------------------------------------------------------------------------
  const auth = getAuth();
  auth.useDeviceLanguage();
  const googleProvider = new GoogleAuthProvider();
  const microsoftProvider = new OAuthProvider("microsoft.com");

  const [error, setError] = useState<string | undefined>(undefined);
  const [isAdmin, setisAdmin] = useState<boolean>(false);  //I'm not sure you actuall need a state for this so you can probably delete

  const handleSignup = (provider: AuthProvider) => {
    
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result); //gives access to the Google API
        const token = credential?.accessToken;
        const user = result.user;
        const email = user.email;
        const fullName = user.displayName;
        const userID = user.uid;  
        console.log("Current user ID")
        console.log(userID)

        const isAdmin = await fetch(`/api/isadmin/${email}`).then(res => res.json())
        if (!isAdmin) {
          auth.signOut()
          setError("Oh no! It seems you are not a registered admin. If you think this is a mistake, please contact miranda.conn@some.ox.ac.uk")

        } else {
          navigate("/database")
          
        }
        
        
      })
      .catch((error) => {
        setError(`Error ${error.code} - ${error.message}`);
      });
  };




  //----------------------------------------------------------------------------------------------------------------------
  return ( 
    <>
    <div className = "navBar">
      <LinkButton target="/" text="back button" image="/back.svg" backcolor = "rgba(0,0,0,0)"/>
      
    </div>  
    <MainWrapper justifyContent="space-around">
        
        <div className="whitePopOut" style ={{position: "absolute", top: "30%", left: "25%", height: "45%"}}>
          <div
            className="textbox"
            style={{
              position: "relative",
              top: "30px",
              left: "30px",
              fontSize: "50px",
              
            }}
          >
            Sign in as Admin
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
            Please sign in using a registered Administrator account.
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
    </MainWrapper>
    </> 
  );
};

export default AdminLogIn;
