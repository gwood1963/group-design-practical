import LinkButton from "../components/LinkButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import MainWrapper from "../components/ContentWrapper";
import {useState, useEffect} from "react"

const GameStart = () => {
  //ON ANY PAGE WHERE YOU NEED INFORMATION ABOUT THE SIGNED IN USER, COPY AND PASTE THE FOLLOWING SECTION AT THE TOP
  //--------------------------------------------------------------------------------------------------------------
  //it will fetch the data of the currently signed in candidate, once when the page opens


  //GEORGE: use the following states varaibles to query the database. They will be of hte signed in candidate. userId is unique.
  const [email,setEmail] = useState<string|null>("")
  const [fullName,setName] = useState<string|null>("")
  const [userId,setUserId] = useState<string>("") 

  const auth = getAuth();

  useEffect(() => {onAuthStateChanged(auth, (user) =>{  //I think the useEffect here is needed to prevent infinite loops where the page re-renders, causing the emails and names to be set again, which causes another re-render  etc
    if (user){
      setEmail(user.email);
      setName(user.displayName);
      setUserId(user.uid);  //uniquely identifies users.
      console.log(user.uid)
      console.log(user.email)
      console.log(user.displayName)
      
    }
    })
  }, []);


  const navigate = useNavigate();

  return (
    <>
      <div className="navBar">
        <div style={{ position: "relative", left: "93%" }}>
          <ActionButton
            text="Log out"
            onClick={() => {
              auth.signOut();
              navigate("/signup");
            }}
            backcolor="rgba(0,0,0,0)"
          />
        </div>
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
            Ready to start?
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
            This game is about{" "}
            <b>probem solving, optimisation and creative thinking. </b> <br />{" "}
            <br />
            The instructions and controls will be explained on screen. <br />{" "}
            <br />
            When you press <i>Start</i>, the game will begin. You will have 10
            minutes to submit your solution; you <b>must</b> press{" "}
            <i>Submit and Move On</i> before the timer in the corner of the
            screen hits zero. <br />
            <br />
            If you Log Out before submitting, your score will not be recorded.{" "}
            <br />
            <br />
            <b>Ready?</b> <br />
          </div>

          <div style={{ position: "relative", top: "40px", left: "20px" }}>
            <LinkButton target="/game" text="Start" />
          </div>
        </div>
      </MainWrapper>
    </>
  );
};

export default GameStart;
