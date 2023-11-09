import './App.css';
import React, { useState, useEffect,useRef } from 'react';

import db from "./db.json"

function App() {
  const [data, setData] = useState(db.users);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [totalTime] = useState(600);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(totalTime);
  const [timer, setTimer] = useState(totalTime); 
  const [quizOverDueToTimeout, setQuizOverDueToTimeout] = useState(false);
const timerRef = useRef();




useEffect(() => {
  if (showQuiz) {
    if (timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
        setTotalTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      if (currentQuizIndex === data.length - 1) {
        setQuizOverDueToTimeout(true);
        handleQuizSubmit();
      } else {
        handleNextClick(); 
      }
    }
  }

  return () => {
    clearInterval(timerRef.current);
  };
}, [timer, showQuiz, currentQuizIndex,data]);

useEffect(() => {
  if (totalTimeRemaining === 0) {
    handleQuizSubmit();
  }
}, [totalTimeRemaining]);




useEffect(() => {
  if (!showQuiz) {
    setTimer(totalTimeRemaining);
  }
}, [showQuiz, totalTimeRemaining]);

 

  const handleAnswerChange = (selectedOption) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuizIndex]: selectedOption,
    });
  }

  const progress = (currentQuizIndex / (data.length - 1)) * 100;

  const handleNextClick = () => {
    if (currentQuizIndex < data.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    }
  }

  const handlePreviousClick = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
    }
  }

  const calculateScore = () => {
    let correctAnswers = 0;
    data.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  }

  const handleQuizSubmit = () => {
    const userScore = calculateScore();
    setScore(userScore);
    setShowPopup(true);
  }

  const closePopup = () => {
    setShowPopup(false);
    setCurrentQuizIndex(0);
    setSelectedAnswers({});
    setShowQuiz(false);
    setUserName("")
    setUserEmail("")
    setTotalTimeRemaining(totalTime); 
  }

  const handleStartQuiz = () => {
    if (userName && userEmail) {
      setShowQuiz(true);
    }
  }

  return (
    <div className="App">

<div className="navbar">
  <h1 className="logo">Quizzz World</h1>
</div>
      
      {!showQuiz ? (
      <>
        <h1 className="quiz-title">Welcome to the quiz world</h1>
        <p className='instruction'>Total time :10 minutes</p>
        <form className="user-info-form">
          <label className="input-label">
            Name:
            <input
              type="text"
              className="input-field"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>
          <label className="input-label">
            Email:
            <input
              type="email"
              className="input-field"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </label>
          <button type="button" onClick={handleStartQuiz} className="start-button">
            Start Quiz
          </button>
        </form>
        </>
      ) : (
        <div>
          <form className="quiz-form">
            {data[currentQuizIndex] && (
              <div className="question-container active">
                <p className="question-text">{data[currentQuizIndex].question}</p>
                {data[currentQuizIndex].options.map((option, optionIndex) => (
                  <label key={optionIndex} className="option-label">
                    <input
                      type="radio"
                      name={`question-${currentQuizIndex}`}
                      value={option}
                      checked={selectedAnswers[currentQuizIndex] === option}
                      onChange={() => handleAnswerChange(option)}
                      className="radio-button"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            <div className="button-container ">
              {currentQuizIndex > 0 && (
                <button type="button" onClick={handlePreviousClick} className="previous-button mr-20">
                  Previous
                </button>
              )}
              {currentQuizIndex < data.length - 1 && (
                <button type="button" onClick={handleNextClick} className="next-button">
                  Next
                </button>
              )}
              {currentQuizIndex === data.length - 1 && (
                <button type="button" onClick={handleQuizSubmit} className="submit-button">
                  Submit
                </button>
              )}
            </div>
          </form>

         
          <div className="timer">
            {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60} Time left
          </div>

          <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
          
        </div>
        <div className="progress-text">
            {currentQuizIndex } / {data.length} questions answered
          </div>

          {showPopup && (
  <div className="popup">
    <div className="popup-content">
      <h2 className="popup-title">
        {quizOverDueToTimeout ? "☹ Time's Up!" : "☻ Quiz Complete"}
      </h2>
      <p className="user-info">User Name: {userName}</p>
      <p className="user-info">User Email: {userEmail}</p>
      <p className="user-score">Your Score: {score} / {data.length}</p>
      <p className="score-message">
        {score ===  data.length  ? "Excellent!!!!" : score >= 8 ? "Good" : "Oops !!. Low score"}
      </p>
      <button onClick={closePopup} className="close-button">
        Close
      </button>
    </div>
  </div>
)}
        </div>
      )}

<div className="footer">
  <p>&copy; 2023 Quiz World done by BALA. All copy rights reserved.</p>
</div>


    </div>
  );
}

export default App;