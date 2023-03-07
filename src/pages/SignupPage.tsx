import LinkButton from "../components/LinkButton";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";

const SignupPage = () => {
  const navigate = useNavigate();

  const auth = getAuth();
  auth.useDeviceLanguage();
  const provider = new GoogleAuthProvider();

  const [error, setError] = useState<string | undefined>(undefined);

  return (
    <>
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
        <ActionButton
          onClick={(_) => {
            signInWithPopup(auth, provider)
              .then((_) => {
                navigate("/");
              })
              .catch((error) => {
                setError(`Error ${error.code} - ${error.message}`);
              });
          }}
          text="Sign in with Google"
        />
        {error !== undefined && <p>error</p>}
      </main>
    </>
  );
};

export default SignupPage;
