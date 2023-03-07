import LinkButton from "../components/LinkButton";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <button
          onClick={(_) => {
            signInWithPopup(auth, provider)
              .then((_) => {
                navigate("/");
              })
              .catch((error) => {
                setError(`Error ${error.code} - ${error.message}`);
              });
          }}
        >
          Sign in with Google
        </button>
        {error !== undefined && <p>error</p>}
      </main>
    </>
  );
};

export default SignupPage;
