import MainWrapper from "../components/ContentWrapper";
import LinkButton from "../components/LinkButton";

const AdminLogIn = () => {
  return (  
    <MainWrapper>
        <div className = "navBar">
            <LinkButton target="/" text="back button" image="/back.svg" backcolor = "rgba(0,0,0,0)"/>
        </div>  
        <div>Insert here the log in stuff for an Admin.</div>
        <LinkButton text = "Continue" target = "/database"/>
    </MainWrapper>
  );
};

export default AdminLogIn;
