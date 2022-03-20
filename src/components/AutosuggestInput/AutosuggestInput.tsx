import React, { useContext, useState } from "react";
import Autosuggest, {
  GetSuggestionValue,
  SuggestionsFetchRequested,
} from "react-autosuggest";
import { Button } from "reactstrap";
import { AppContext } from "../../App";
import { toast } from "react-toastify";
import Scroll from "react-scroll";
import { getSuggestions } from "./getSuggestions";
import "./Autosuggest.scss";

const scroll = Scroll.animateScroll;

export const AutosuggestInput = ({
  typeOfGuess = "movie",
}: {
  typeOfGuess: "movie" | "actor";
}) => {
  const [inputValue, changeInputValue] = useState("");
  const [suggestions, changeSuggestions] = useState<
    { [key: string]: string | number | boolean }[]
  >([]);
  const [currentSelection, changeCurrentSelection] = useState({
    name: "",
    year: "",
    image: "",
  });

  const { guesses, changeGuesses } = useContext(AppContext);

  const onSuggestionsFetchRequested = async (value: {
    [key: string]: string;
  }) => {
    changeSuggestions(await getSuggestions(value, typeOfGuess));
  };

  const onSuggestionsClearRequested = () => {
    changeSuggestions([]);
  };

  const getSuggestionValue = (
    suggestion: GetSuggestionValue<{ [key: string]: string | number }>
  ) => suggestion.name;

  const handleInputGuess = ({
    name,
    year,
    image,
  }: {
    name: string;
    year: string;
    image: string;
  }) => {
    if (!name) {
      toast.error(<p className="toast_message">Unknown {typeOfGuess}!</p>, {
        theme: "dark",
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Don't show any more toasts in queue
      setTimeout(() => toast.clearWaitingQueue(), 500);
    } else {
      changeGuesses([
        ...guesses,
        { guess: name, year, image, incorrect: false, type: typeOfGuess },
      ]);
      changeInputValue("");
      changeCurrentSelection({
        name: "",
        year: "",
        image: "",
      });
      scroll.scrollToBottom();
    }
  };

  const renderSuggestion = (suggestion: {
    [key: string]: string | number | boolean;
  }) => (
    <div
      className="suggestion_container"
      onClick={() =>
        changeCurrentSelection({
          name: suggestion.name.toString(),
          year: suggestion.year ? suggestion.year.toString() : "",
          image: suggestion.image.toString(),
        })
      }
    >
      <p className="suggested_name">
        {suggestion.name.toString()}
        {suggestion.year ? ` (${suggestion.year})` : ""}
      </p>
    </div>
  );

  return (
    <div className="input_container">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={
          onSuggestionsFetchRequested as unknown as SuggestionsFetchRequested
        }
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={
          getSuggestionValue as unknown as GetSuggestionValue<{
            [key: string]: string | number | boolean;
          }>
        }
        renderSuggestion={renderSuggestion}
        containerProps={{
          className: "autosuggest_container",
        }}
        inputProps={{
          className: "autosuggest_input form-control",
          value: inputValue,
          onChange: (form, event) => {
            changeInputValue(event.newValue.toUpperCase());
          },
        }}
      />
      <Button
        className="guess_button"
        onClick={() => handleInputGuess(currentSelection)}
      >
        GUESS
      </Button>
    </div>
  );
};
