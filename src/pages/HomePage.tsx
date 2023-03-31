import MainWrapper from "../components/ContentWrapper";
import LinkButton from "../components/LinkButton";

const HomePage = () => {
  return (    
    <MainWrapper>
      <div style ={{position: "absolute", top: "20px", right: "5px"}}><LinkButton text="Admin" target="adminlogin"/></div>
      <div className = "welcome">
        <div className = "textbox" style ={{visibility: "hidden", animation: "fadeIn 2s forwards", fontSize: "150px"}}>Welcome.</div>
        <div className = "textbox" style ={{visibility: "hidden", animation: "fadeIn 1s forwards", animationDelay: "3s", fontSize: "50px"}}>You seem like you like a puzzle.</div>
        <div className = "textbox" style= {{visibility: "hidden", animation: "fadeIn 2s forwards", animationDelay: "5s"}}>Want to try ours?</div>
        <div className = "textbox" style= {{visibility: "hidden", animation: "fadeIn 2s forwards", animationDelay: "5s"}}>
          <LinkButton text="Continue" target="signup" />
          
        </div>
      </div>
    </MainWrapper>
  );
};

export default HomePage;
