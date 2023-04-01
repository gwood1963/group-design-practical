import { Link } from "react-router-dom";

export interface LinkButtonProps {
  text: string;
  image?: string;
  target: string;
  backcolor?: string;
}

const LinkButton = ({ text, image, target, backcolor }: LinkButtonProps) => {
  return (
    <Link
      to={target}
      style={{
        color: "white",
        backgroundColor: backcolor ? backcolor : "#00A2ED",  /*You can optionally specify a background colour different from default (transparent) with paramter backcolor*/
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
