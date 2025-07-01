// Ginny's Fitness Tracker App - React + Tailwind with Calendar View
// Features: Daily checklist, exercise list, weight/reps tracking, notes, calendar view, progress tracking
// LocalStorage used to save data

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { format, parseISO, compareDesc } from "date-fns";

const initialExercises = [
  "Leg Press",
  "Assisted Pull Up",
  "Seated Row",
  "Lat Pull Down",
  "Bicep Curl Machine",
  "Tricep Rope Pushdown",
  "Ball Leg Twist Abs",
  "Hamstring Bridge",
  "Squat with Dumbbells",
  "TRX Pull Up Slants",
  "Elliptical",
  "Warm Up + Stretch"
];

export default function FitnessTracker() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [workouts, setWorkouts] = useState({});
  const [exercises, setExercises] = useState(initialExercises);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("workouts") || "{}");
    setWorkouts(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const getLastEntry = (exercise) => {
    const dates = Object.keys(workouts).filter((date) => date !== selectedDate);
    const sorted = dates.sort((a, b) => compareDesc(parseISO(a), parseISO(b)));
    for (let date of sorted) {
      const entry = workouts[date]?.[exercise];
      if (entry && (entry.weight || entry.reps)) {
        return {
          weight: entry.weight || "",
          reps: entry.reps || "",
          notes: entry.notes || "",
          sets: entry.sets || ""
        };
      }
    }
    return { weight: "", reps: "", notes: "", sets: "" };
  };

  const updateExercise = (exercise, field, value) => {
    setWorkouts((prev) => {
      const dayLog = prev[selectedDate] || {};
      const entry = dayLog[exercise] || getLastEntry(exercise);
      return {
        ...prev,
        [selectedDate]: {
          ...dayLog,
          [exercise]: {
            ...entry,
            [field]: field === "checked" ? !entry.checked : value
          }
        }
      };
    });
  };

  const addExercise = (name) => {
    if (name && !exercises.includes(name)) {
      setExercises([...exercises, name]);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">Ginny's Fitness</h1>

      <div className="mb-4 text-center">
        <label className="font-medium mr-2">Select Date:</label>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="inline-block w-auto"
        />
      </div>

      <Card className="mb-4">
        <CardContent>
          {exercises.map((ex, idx) => {
            const entry = workouts[selectedDate]?.[ex] || getLastEntry(ex);
            return (
              <div key={idx} className="flex flex-col gap-1 mb-4 border-b pb-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={!!entry.checked}
                    onCheckedChange={() => updateExercise(ex, "checked")}
                  />
                  <span className="font-medium">{ex}</span>
                </div>
                <div className="flex gap-2 ml-6">
                  <Input
                    className="w-20"
                    placeholder="Sets"
                    value={entry.sets || ""}
                    onChange={(e) => updateExercise(ex, "sets", e.target.value)}
                  />
                  <Input
                    className="w-20"
                    placeholder="Reps"
                    value={entry.reps || ""}
                    onChange={(e) => updateExercise(ex, "reps", e.target.value)}
                  />
                  <Input
                    className="w-24"
                    placeholder="Weight"
                    value={entry.weight || ""}
                    onChange={(e) => updateExercise(ex, "weight", e.target.value)}
                  />
                </div>
                <div className="ml-6">
                  <Input
                    className="w-full"
                    placeholder="Notes"
                    value={entry.notes || ""}
                    onChange={(e) => updateExercise(ex, "notes", e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="mb-4">
        <Input
          placeholder="Add new exercise"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addExercise(e.target.value);
              e.target.value = "";
            }
          }}
        />
      </div>

      <Button className="bg-pink-500 hover:bg-pink-600 text-white"
        onClick={() => {
          alert("Progress tracking coming soon!");
        }}
      >
        View Progress (Coming Soon)
      </Button>
    </div>
  );
}
