
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Award, Check, X, Loader2, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const questions = [
  {
    question: "What is the correct way to pass a value from a parent component to a child component in React?",
    options: ["Using props", "Using state", "Using context", "Using refs"],
    answer: "Using props",
    points: 10,
  },
  {
    question: "Which hook is used to manage state in a functional component?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    answer: "useState",
    points: 10,
  },
  {
    question: "What does JSX stand for?",
    options: ["JavaScript XML", "JavaScript Extension", "Java Syntax Extension", "JSON Scripting Extension"],
    answer: "JavaScript XML",
    points: 10,
  },
  {
    question: "In React, what is used to handle side effects like data fetching or subscriptions?",
    options: ["useState", "useCallback", "useEffect", "useMemo"],
    answer: "useEffect",
    points: 10,
  },
  {
    question: "What is the purpose of a `key` prop when rendering a list of elements?",
    options: [
        "It is a globally unique identifier for the element.", 
        "It helps React identify which items have changed, are added, or are removed.", 
        "It is used for styling the elements.", 
        "It is required for accessibility."
    ],
    answer: "It helps React identify which items have changed, are added, or are removed.",
    points: 10,
  }
];

export default function ReactFundamentalsTestPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const { toast } = useToast();

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
      setPoints(points + (questions[currentQuestionIndex].points || 0));
    }
    setSelectedAnswer(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleSubmit = () => {
    let finalScore = score;
    let finalPoints = points;
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
        finalScore = score + 1;
        finalPoints = points + (questions[currentQuestionIndex].points || 0);
    }
    setScore(finalScore);
    setPoints(finalPoints);
    setIsFinished(true);
    toast({
        title: "Assessment Complete!",
        description: `You scored ${finalScore} out of ${questions.length} and earned ${finalPoints} points. A certificate has been added to your profile.`,
        duration: 5000,
    });
  }
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setPoints(0);
    setIsFinished(false);
  }
  
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (isFinished) {
    return (
        <div className="p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <Card className="w-full max-w-xl text-center">
                <CardHeader>
                    <Award className="w-16 h-16 mx-auto text-yellow-500" />
                    <CardTitle className="text-2xl mt-4">Congratulations!</CardTitle>
                    <CardDescription>You have completed the React.js Fundamentals Assessment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-4xl font-bold">Your Score: {score}/{questions.length}</p>
                    <p className="text-lg text-muted-foreground">You earned <span className="font-bold text-primary">{points}</span> points!</p>
                    <p className="mt-2 text-muted-foreground">This achievement has been added to your profile.</p>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button onClick={handleRestart}>Take Again</Button>
                </CardFooter>
            </Card>
        </div>
    )
  }

  return (
    <div className="p-4 md:p-8 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>React.js Fundamentals Test</CardTitle>
          <CardDescription>Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-lg mb-4">{questions[currentQuestionIndex].question}</p>
          <RadioGroup value={selectedAnswer ?? ""} onValueChange={setSelectedAnswer}>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="justify-end">
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={handleNextQuestion} disabled={!selectedAnswer}>
              Next Question <ArrowRight className="ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!selectedAnswer}>
              Submit Assessment
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
