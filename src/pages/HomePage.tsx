import LinkButton from "../components/LinkButton";

const HomePage = () => {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: "100%",
      }}
    >
      <LinkButton text="Candidate" target="signup" />
      <LinkButton text="Admin" target="adminRoot" />
    </main>
  );
};

export default HomePage;
