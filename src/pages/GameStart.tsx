import LinkButton from "../components/LinkButton";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import MainWrapper from "../components/ContentWrapper";
import Checkbox from "../components/Checkbox";

const GameStart = () => {
    const auth = getAuth();
    const navigate = useNavigate();


    return (

    <>
      <div className = "navBar">
        <div style = {{position: "relative", left: "93%"}}>
            <ActionButton
                text="Log out"
                onClick={() => {
                auth.signOut();
                navigate("/signup");
                }}
                backcolor= "rgba(0,0,0,0)"
            />
        </div>
      </div>
      <MainWrapper justifyContent="space-around">
        <div className = "whitePopOut">
            <div className = "textbox" style = {{position: "relative", top: "30px", left: "30px", fontSize: "50px",}} >Ready to start?</div>
            <div style = {{padding: "30px", fontSize: "20px", position: "relative", top: "40px", left: "10px"}}>
                This game is about <b>probem solving, optimisation and creative thinking. </b> <br/> <br/>
                The instructions and controls will be explained on screen. <br/> <br/>
                When you press <i>Start</i>, the game will begin. You will have 10 minutes to submit your solution; you <b>must</b> press <i>Submit and Move On</i> before the timer in the corner of the screen hits zero. <br/><br/>
                If you Log Out before submitting, your score will not be recorded. <br/>
                <br/>
                <b>Ready?</b> <br/>
            </div>

            <div style ={{position: "relative", top: "40px", left: "20px"}}><LinkButton target="/game" text="Start" /></div>
            
        </div>
      </MainWrapper>
    </>
    );
};

export default GameStart;
