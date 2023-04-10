import { useEffect } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import ActionButton from "./ActionButton";
type FeedbackModalProps = {
  score?: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  submit: () => void;
};

const FeedbackModal = ({
  score,
  open,
  setOpen,
  submit,
}: FeedbackModalProps) => {
  const close = () => {
    setOpen(false);
  };

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  const content = () => {
    const isValid = score; // If score is defined, isValid true.
    const text = isValid
      ? `You got ${score} ${
          score !== 1 ? "people" : "person"
        } from West Office to East Office`
      : "This submission is invalid";
    return (
      <>
        <div
          style={{
            width: "50%",
            height: "33%",
            position: "absolute",
            left: "25%",
            top: "25%",
            background:
              "linear-gradient(180deg, rgb(135,219,255) 0%, rgb(204,243,255) 100%)",

            borderRadius: "15px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p>{text}</p>
          <ActionButton
            onClick={() => (isValid ? submit() : close())}
            text={isValid ? "Submit" : "Close"}
          />
        </div>
      </>
    );
  };

  return (
    <Modal
      isOpen={open}
      contentElement={content}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
      }}
    />
  );
};

export default FeedbackModal;
