import { FormEvent, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Modal from "react-modal";
import { RemoveScroll } from "react-remove-scroll";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "reactstrap";
import * as Ladda from "ladda";
import "./ContactModal.scss";
import "../../HowToPlayModal/HowToPlayModal.scss";
import "../Header.scss";
import "ladda/dist/ladda.min.css";

export const customModalStyles = {
  content: {
    top: "10%",
    left: "auto",
    right: "auto",
    margin: "0 auto",
    paddingBottom: "5rem",
    outline: "none",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(3px)",
    zIndex: 999999999,
    // Extra height to cover footer
    height: "105vh",
  },
};

export const ContactModal = ({
  showContactModal,
  changeShowContactModal,
}: {
  showContactModal: boolean;
  changeShowContactModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [serverState, setServerState] = useState({
    submitting: false,
    status: {
      ok: false,
      msg: "",
    },
  });
  const [name, changeName] = useState("");
  const [email, changeEmail] = useState("");
  const [messsage, changeMessage] = useState("");

  const laddaRef = useRef<HTMLButtonElement | null>(null);

  const handleServerResponse = (
    ok: boolean,
    msg: string,
    form: HTMLFormElement
  ) => {
    setServerState({
      submitting: false,
      status: { ok, msg },
    });

    if (ok) {
      form.reset();
      changeName("");
      changeEmail("");
      changeMessage("");
    }
  };

  useEffect(() => {
    if (!showContactModal) {
      if (
        serverState.submitting ||
        serverState.status.ok ||
        serverState.status.msg
      ) {
        setServerState({
          submitting: false,
          status: {
            ok: false,
            msg: "",
          },
        });
      }
    }
  }, [
    serverState.status.msg,
    serverState.status.ok,
    serverState.submitting,
    showContactModal,
  ]);

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    setServerState({ submitting: true, status: { ok: false, msg: "" } });

    axios({
      method: "post",
      url: `${process.env.REACT_APP_GETFORM_CONTACT_ENDPOINT}`,
      data: new FormData(form),
    })
      .then((r) => {
        handleServerResponse(
          true,
          "Your Hollywoodle contact form submission has been sent successfully! We will get back to you shortly.",
          form
        );
      })
      .catch((r) => {
        handleServerResponse(false, r.response.data.error, form);
      });
  };

  // Remove all displayed toasts on modal open
  useEffect(() => {
    if (showContactModal) toast.dismiss();
  }, [showContactModal]);

  useEffect(() => {
    if (laddaRef && laddaRef.current) {
      let l = Ladda.create(laddaRef.current);
      if (serverState.submitting) {
        l.start();
      } else {
        if (l.isLoading()) {
          l.stop();
        }
      }
    }
  }, [serverState.submitting]);

  const handleCloseModal = () => {
    changeShowContactModal(false);
  };

  return (
    <RemoveScroll enabled={showContactModal}>
      <Modal
        isOpen={showContactModal}
        onRequestClose={handleCloseModal}
        contentLabel="Support Modal"
        className="modal_container archived_modal"
        shouldFocusAfterRender={false}
        style={customModalStyles}
      >
        <h2 className="archived_game_title">CONTACT HOLLYWOODLE</h2>
        <button
          className="close_modal_button archived_game"
          onClick={handleCloseModal}
        >
          <AiOutlineClose size={20} color="#fff" />
        </button>
        <div className="contact_prompt">
          <p>
            If you have any questions, comments, or requests - or if you think
            you've found a Hollywoodle bug - feel free to reach out to us!
          </p>
        </div>
        <form onSubmit={handleOnSubmit}>
          <div className="contact_input_container">
            <label htmlFor="name_field">Name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              id="name_field"
              maxLength={150}
              onChange={(e) => changeName(e.target.value)}
            />
          </div>
          <div className="contact_input_container">
            <label htmlFor="email_field">Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              id="email_field"
              aria-describedby="email"
              maxLength={150}
              onChange={(e) => changeEmail(e.target.value)}
            />
          </div>
          <div className="contact_input_container">
            <label htmlFor="textarea_field">Message</label>
            <textarea
              className="form-control"
              name="message"
              id="textarea_field"
              maxLength={1000}
              rows={7}
              onChange={(e) => changeMessage(e.target.value)}
            />
          </div>
          <div className="submit_button_container">
            <Button
              type="submit"
              className={`guess_button ladda-button dark ${
                serverState.submitting ? "loading" : ""
              } ${
                name && email && messsage ? "" : "disabled"
              } leaderboard_set_username`}
              data-style="zoom-out"
              innerRef={laddaRef}
            >
              <span className="ladda-label">SUBMIT</span>
            </Button>
          </div>
          {serverState.status.msg && (
            <div className="contact_success_message_container">
              <p>{serverState.status.msg}</p>
            </div>
          )}
        </form>
      </Modal>
    </RemoveScroll>
  );
};
