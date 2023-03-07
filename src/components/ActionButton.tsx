interface ActionButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
}
const ActionButton = ({ onClick, text }: ActionButtonProps) => {
  return (
    <button
      style={{
        color: "white",
        backgroundColor: "#30beff",
        borderRadius: "5px",
        padding: "0.5rem",
        margin: "1rem",
        border: "none",
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default ActionButton;
