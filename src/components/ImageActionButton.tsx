interface ImageActionButtonProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    text: string;
    image?: string;
    backcolor?: string;
  }
  const ImageActionButton = ({ onClick, text ,image, backcolor }: ImageActionButtonProps) => {
    return (
      <button
        style={{
          color: "white",
          backgroundColor: backcolor ? backcolor : "#00A2ED",
          borderRadius: "5px",
          padding: "0.5rem",
          margin: "1rem",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
        onClick={onClick}
      >
        {image ? <img src={image} width="20" alt={text} /> : text}
      </button>
    );
  };
  
  export default ImageActionButton;
  