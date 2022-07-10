import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "reactstrap";
import { AiOutlineCheckCircle } from "react-icons/ai";
import * as Ladda from "ladda";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../App";
import { Footer } from "../../components/Footer/Footer";
import { BackButton } from "../BackButton";
import "./Contact.scss";
import "ladda/dist/ladda.min.css";

export const Contact = () => {
  const { darkMode } = useContext(AppContext);
  const location = useLocation();
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    if (location.pathname !== "/contact") {
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
    location,
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
    if (location.pathname === "/contact") toast.dismiss();
  }, [location]);

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

  return (
    <div className={`contact_container ${darkMode ? "dark" : ""}`}>
      <h2 className={`contact_title_header ${darkMode ? "dark" : ""}`}>
        <BackButton />
        CONTACT HOLLYWOODLE
      </h2>
      <div className="contact_prompt">
        <p>
          If you have any questions, comments, requests, suggestions - or if you
          think you've found a Hollywoodle bug - feel free to reach out to us!
        </p>
      </div>
      <form
        className={`contact_form ${darkMode ? "dark" : ""}`}
        onSubmit={handleOnSubmit}
      >
        <div className={`contact_input_container ${darkMode ? "dark" : ""}`}>
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
        <div className={`contact_input_container ${darkMode ? "dark" : ""}`}>
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
        <div className={`contact_input_container ${darkMode ? "dark" : ""}`}>
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
          <div
            className={`contact_success_message_container ${
              darkMode ? "dark" : ""
            }`}
          >
            <AiOutlineCheckCircle
              className="contact_success_checkmark"
              size={50}
            />
            <p>{serverState.status.msg}</p>
          </div>
        )}
      </form>
      <Footer />
    </div>
  );
};
