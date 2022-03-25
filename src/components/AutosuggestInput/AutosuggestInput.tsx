import React, {
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { getMovieCast } from "./getMovieCast";
import { getMostRecent } from "../../utils/getMostRecent";
import isMobile from "ismobilejs";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import "./Autosuggest.scss";

const scroll = Scroll.animateScroll;

export const AutosuggestInput = ({
  typeOfGuess = "movie",
}: {
  typeOfGuess: "movie" | "actor";
}) => {
  const currentIsMobile = isMobile();

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
  const [movieCast, changeMovieCast] = useState<number[]>([]);

  const { firstActor, guesses, changeGuesses } = useContext(AppContext);

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

  useEffect(() => {
    const source = axios.CancelToken.source();

    if (currentSelection && currentSelection.id && typeOfGuess === "movie") {
      const fetchData = async () => {
        try {
          const results = await getMovieCast(currentSelection.id);
          changeMovieCast(results);
        } catch (e) {
          console.error(e);
        }
      };

      fetchData();
    }

    return () => source.cancel();
  }, [currentSelection, typeOfGuess]);

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
      let currentActorId: number = Number(firstActor.id);

      const prevGuess = guesses.sort((a, b) => {
        return (
          (a ? Number(a.guess_number) : 0) - (b ? Number(b.guess_number) : 0)
        );
      })[guesses.length - 1];

      if (typeOfGuess === "actor") {
        const mostRecentMovie = getMostRecent(guesses, "movie");
        if (
          mostRecentMovie &&
          mostRecentMovie.cast &&
          Array.isArray(mostRecentMovie.cast)
        ) {
          changeMovieCast(mostRecentMovie.cast);
          currentActorId = id;
        }
      } else {
        currentActorId =
          prevGuess && prevGuess.type === "actor"
            ? Number(prevGuess.id)
            : Number(firstActor.id);
      }

      const newGuess: {
        [key: string]:
          | string
          | number
          | number[]
          | boolean
          | { [key: string]: string | number };
      } = {
        guess_number: guesses.length,
        id,
        guess: name,
        prev_guess: prevGuess
          ? {
              id: Number(prevGuess.id),
              guess: prevGuess.guess.toString(),
              type: prevGuess.type.toString(),
              year: prevGuess.year.toString(),
            }
          : { id: 0, guess: "", type: "", year: "" },
        year,
        image,
        incorrect: !!!movieCast.find((id) => id === currentActorId),
        cast: movieCast,
        type: typeOfGuess,
      };

      changeGuesses([...guesses, newGuess]);
      changeInputValue("");
      changeCurrentSelection({
        id: 0,
        name: "",
        year: "",
        image: "",
      });

      // Only scroll to bottom on click on larger screens
      if (!currentIsMobile.any) {
        scroll.scrollToBottom();
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      if (currentSelection && currentSelection.name) {
        handleInputGuess(currentSelection);
      }
    }
  };

  const handleSuggestionSelected = (
    e: React.FormEvent<any>,
    data: Autosuggest.SuggestionSelectedEventData<{
      [key: string]: string | number | boolean;
    }>
  ) => {
    const suggestion = data.suggestion;
    changeCurrentSelection({
      id: Number(suggestion.id),
      name: suggestion.name.toString(),
      year: suggestion.year ? suggestion.year.toString() : "",
      image: suggestion.image.toString(),
    });
  };

  const renderSuggestion = (suggestion: {
    [key: string]: string | number | boolean;
  }) => (
    <div className="suggestion_container">
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

  const autoFocusInput = () => {
    setTimeout(() => {
      const inputEl = document.getElementById("autosuggest_input");
      if (inputEl && !inputValue) inputEl.focus();
    }, 500);
  };

  return (
    <div className="input_container">
      <Autosuggest
        ref={autoFocusInput}
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
        renderInputComponent={(inputProps) => (
          <div className="autosuggest_input_container">
            <input {...inputProps} />
            <div className="input_symbol_container">
              <AiOutlineSearch size={20} color={"rgb(150, 150, 150)"} />
            </div>
          </div>
        )}
        containerProps={{
          className: "autosuggest_container",
        }}
        inputProps={{
          className: "autosuggest_input form-control",
          id: "autosuggest_input",
          value: inputValue,
          onChange: (form, event) => {
            changeInputValue(event.newValue.toUpperCase());
          },
          onKeyDown: handleKeyDown,
        }}
        onSuggestionSelected={handleSuggestionSelected}
      />

      <Button
        className="guess_button"
        onClick={() => handleInputGuess(currentSelection)}
      >
        GUESS {typeOfGuess.toUpperCase()}
      </Button>
    </div>
  );
};
