
import { useState, useEffect } from "react";

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
  const [today, setToday] = useState(new Date().toISOString().split("T")[0]);
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
    const dates = Object.keys(workouts).filter((date) => date !== today).sort().reverse();
    for (let date of dates) {
      const entry = workouts[date]?.[exercise];
      if (entry && (entry.weight || entry.reps)) {
        return {
          weight: entry.weight || "",
          reps: entry.reps || ""
        };
      }
    }
    return { weight: "", reps: "" };
  };

  const updateExercise = (exercise, field, value) => {
    setWorkouts((prev) => {
      const dayLog = prev[today] || {};
      const entry = dayLog[exercise] || getLastEntry(exercise);
      return {
        ...prev,
        [today]: {
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
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center", color: "deeppink" }}>Ginny's Fitness</h1>

      {exercises.map((ex, idx) => {
        const entry = workouts[today]?.[ex] || getLastEntry(ex);
        return (
          <div key={idx} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
            <label>
              <input
                type="checkbox"
                checked={!!entry.checked}
                onChange={() => updateExercise(ex, "checked")}
              />{" "}
              <strong>{ex}</strong>
            </label>
            <div style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
              <input
                placeholder="Weight"
                value={entry.weight || ""}
                onChange={(e) => updateExercise(ex, "weight", e.target.value)}
                style={{ marginRight: "0.5rem", width: "80px" }}
              />
              <input
                placeholder="Reps"
                value={entry.reps || ""}
                onChange={(e) => updateExercise(ex, "reps", e.target.value)}
                style={{ width: "80px" }}
              />
            </div>
          </div>
        );
      })}

      <input
        placeholder="Add new exercise"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addExercise(e.target.value);
            e.target.value = "";
          }
        }}
        style={{ width: "100%", padding: "0.5rem", marginTop: "1rem" }}
      />
    </div>
  );
}
