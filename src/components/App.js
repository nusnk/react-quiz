import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const initialState = {
  questions: [],
  //loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

const SECS_PER_QUESTION = 30;

function reducer(state, action) {
  switch(action.type) {
    case "dataReceived": 
      return {
        ...state,
        questions: action.paylaod,
        status: "ready",
      };
    case "dataFailed": 
      return {
        ...state,
        status: "error",
      };
    case "start": 
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION
      };
    case "newAnswer": 
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption
          ? state.points + question.points
          : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore: state.points > state.highscore ? state.points : state.highscore
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        highscore: state.highscore,
        status: "ready",
      };

    case "tick": 
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status
      };
    default: 
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [{
    questions,
    status,
    index,
    answer,
    points,
    highscore,
    secondsRemaining
  }, dispatch] = useReducer(reducer, initialState);

  const maxPossiblePoints = questions.reduce((pointsSum, question) => pointsSum + question.points , 0);

  const numQuestions = questions.length;
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", paylaod: data}))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return <div className="app">
    <Header/>
    <Main>
      {status === "loading" && <Loader/>}
      {status === "error" && <Error/>}
      {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>}
      {status === "active" && (
        <>
          <Progress
            index={index}
            numQuestions={numQuestions}
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            answer={answer}
          />
          <Question
            answer={answer}
            dispatch={dispatch}
            question={questions[index]}
          />
          <Footer>
            <Timer
              dispatch={dispatch}
              secondsRemaining={secondsRemaining}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              numQuestions={numQuestions}
              index={index}
            />
          </Footer>
        </>
      )}
      { status === "finished" && (
        <FinishScreen
          points={points}
          maxPossiblePoints={maxPossiblePoints}
          highscore={highscore}
          dispatch={dispatch}
        />
      )}
    </Main>
  </div>
}