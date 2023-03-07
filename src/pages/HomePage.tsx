import MainWrapper from "../components/ContentWrapper";
import LinkButton from "../components/LinkButton";

const HomePage = () => {
  return (
    <MainWrapper
        justifyContent="space-around"
    >
      <LinkButton text="Candidate" target="signup" />
      <LinkButton text="Admin" target="adminRoot" />
    </MainWrapper>
  );
};

export default HomePage;