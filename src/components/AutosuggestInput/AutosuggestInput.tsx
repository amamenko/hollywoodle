import React, { useContext, useRef, useState } from "react";
import Autosuggest, {
  GetSuggestionValue,
  SuggestionsFetchRequested,
} from "react-autosuggest";
import { Button } from "reactstrap";
import { AppContext } from "../../App";
import { toast } from "react-toastify";
import Scroll from "react-scroll";
import { getSuggestions } from "./getSuggestions";
import debounce from "lodash.debounce";
import "./Autosuggest.scss";
import { getMovieCast } from "./getMovieCast";
import { getMostRecent } from "../../utils/getMostRecent";

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
    id: 0,
    name: "",
    year: "",
    image: "",
  });

  const { firstActor, lastActor, guesses, changeGuesses } =
    useContext(AppContext);

  const debounceFn = (type: "movie" | "actor") => {
    return debounce(({ value }) => {
      onSuggestionsFetchRequested(
        value,
        type
      ) as unknown as SuggestionsFetchRequested;
    }, 300);
  };

  // Stores reference to the debounced callback
  const movieDebouncedSearch = useRef(debounceFn("movie")).current;
  const actorDebouncedSearch = useRef(debounceFn("actor")).current;

  const onSuggestionsFetchRequested = async (
    value: string,
    typeOfGuess: "movie" | "actor"
  ) => {
    changeSuggestions(await getSuggestions(value, typeOfGuess));
  };

  const onSuggestionsClearRequested = () => {
    changeSuggestions([]);
  };

  const getSuggestionValue = (
    suggestion: GetSuggestionValue<{ [key: string]: string | number }>
  ) => suggestion.name;

  const handleInputGuess = async ({
    id,
    name,
    year,
    image,
  }: {
    id: number;
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
      let movieCast: number[] = [];
      if (typeOfGuess === "movie") {
        movieCast = await getMovieCast(id);
      } else {
        const mostRecentMovie = getMostRecent(guesses, "movie");
        if (
          mostRecentMovie &&
          mostRecentMovie.cast &&
          Array.isArray(mostRecentMovie.cast)
        ) {
          movieCast = mostRecentMovie.cast;
        }
      }

      const mostRecentActor = getMostRecent(guesses, "actor");
      const mostRecentActorID = mostRecentActor
        ? Number(mostRecentActor.id)
        : Number(firstActor.id);

      changeGuesses([
        ...guesses,
        {
          id,
          guess: name,
          year,
          image,
          incorrect: !movieCast.includes(mostRecentActorID),
          cast: movieCast,
          type: typeOfGuess,
        },
      ]);
      changeInputValue("");
      changeCurrentSelection({
        id: 0,
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
          id: Number(suggestion.id),
          name: suggestion.name.toString(),
          year: suggestion.year ? suggestion.year.toString() : "",
          image: suggestion.image.toString(),
        })
      }
    >
      {typeOfGuess === "actor" ? (
        <img
          className="suggestion_image"
          src={suggestion.image.toString()}
          alt={`${suggestion.name}`}
        />
      ) : (
        <></>
      )}{" "}
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
          typeOfGuess === "movie" ? movieDebouncedSearch : actorDebouncedSearch
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
