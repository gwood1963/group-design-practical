import { Link } from "react-router-dom";

export interface LinkButtonProps {
  text: string;
  image?: string;
  target: string;
}

const LinkButton = ({ text, image, target }: LinkButtonProps) => {
  return (
    <Link
      to={target}
      style={{
        color: "white",
        backgroundColor: "#30beff",
        textDecoration: "none",
        borderRadius: "5px",
        padding: "0.5rem",
        paddingBottom: image ? "0.2rem" : "0.5rem",
        margin: "1rem",
      }}
    >
      {image ? <img src={image} width="20" alt={text} /> : text}
    </Link>
  );
};

export default LinkButton;
