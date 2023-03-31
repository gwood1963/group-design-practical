interface ActionButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
  backcolor?: string;
}
const ActionButton = ({ onClick, text, backcolor }: ActionButtonProps) => {
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
      {text}
    </button>
  );
};

export default ActionButton;
