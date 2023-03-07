import LinkButton from "../components/LinkButton";

const SignupPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100vh",
        backgroundColor: "#def7ff",
      }}
    >
      <LinkButton target="/" text="back button" image="/back.svg" />
      <main
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          height: "100%",
        }}
      >
        <LinkButton target="/" text="Register" />
        <LinkButton target="/" text="Sign in" />
      </main>
    </div>
  );
};

export default SignupPage;
