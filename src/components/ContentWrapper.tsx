import { PropsWithChildren, ReactNode } from "react";
import { Property } from "csstype";

interface MainWrapperProps extends PropsWithChildren {
  flexDirection?: Property.FlexDirection;
  alignItems?: Property.AlignItems;
  justifyContent?: Property.JustifyContent;
  children: ReactNode;
}
const MainWrapper = ({
  flexDirection,
  alignItems,
  justifyContent,
  children,
}: MainWrapperProps) => {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: flexDirection ? flexDirection : "row",
        alignItems: alignItems ? alignItems : "center",
        justifyContent: justifyContent ? justifyContent : "center",
        height: "100%",
        width: "100%",
		margin: 0,
		padding: 0
      }}
    >
      {children}
    </main>
  );
};

export default MainWrapper;
