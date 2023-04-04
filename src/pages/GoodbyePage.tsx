import MainWrapper from "../components/ContentWrapper";
import LinkButton from "../components/LinkButton";
import { useNavigate } from "react-router-dom";

const GoodbyePage = () => {
    const navigate = useNavigate();

  return (    
    <MainWrapper>
      <div className = "welcome">
        <div className = "textbox" style ={{visibility: "hidden", animation: "fadeIn 2s forwards", fontSize: "150px"}}>Thanks for playing!</div>
        <div className = "textbox" style ={{visibility: "hidden", animation: "fadeIn 1s forwards", animationDelay: "2.5s", fontSize: "50px"}}>We'll be in touch regarding your application shortly.</div>
        {/*<div className = "textbox" style= {{visibility: "hidden", animation: "fadeIn 2s forwards", animationDelay: "4.5s"}}>Click to try ours</div>*/}
        <div className = "textbox" style= {{visibility: "hidden", animation: "fadeIn 2s forwards", animationDelay: "4.5s"}}>
          <LinkButton text="Home" target="/" />
          
        </div>
      </div>
    </MainWrapper>
  );
};

export default GoodbyePage;
