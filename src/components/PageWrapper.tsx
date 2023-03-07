import { PropsWithChildren } from "react";

const PageWrapper = ({ children }: PropsWithChildren) => {
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
      {children}
    </div>
  );
};

export default PageWrapper;
