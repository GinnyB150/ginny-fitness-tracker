import { useState, useEffect } from "react";
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

export default function App() {
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
    <div style={{ padding: '1rem', maxWidth: '700px', margin: 'auto', background: 'linear-gradient(to bottom right, #fcd5ce, #cce3ff, #d0f4de)', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', color: '#d6336c', textAlign: 'center' }}>Ginny's Fitness</h1>

      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <label><strong>Select Date: </strong></label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div>
        {exercises.map((ex, idx) => {
          const entry = workouts[selectedDate]?.[ex] || getLastEntry(ex);
          return (
            <div key={idx} style={{ borderBottom: '1px solid #ccc', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <label>
                <input
                  type="checkbox"
                  checked={!!entry.checked}
                  onChange={() => updateExercise(ex, "checked")}
                />
                <strong style={{ marginLeft: '0.5rem' }}>{ex}</strong>
              </label>
              <div style={{ marginLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <input placeholder="Sets" value={entry.sets || ""} onChange={(e) => updateExercise(ex, "sets", e.target.value)} />
                <input placeholder="Reps" value={entry.reps || ""} onChange={(e) => updateExercise(ex, "reps", e.target.value)} />
                <input placeholder="Weight" value={entry.weight || ""} onChange={(e) => updateExercise(ex, "weight", e.target.value)} />
              </div>
              <div style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                <input placeholder="Notes" style={{ width: '100%' }} value={entry.notes || ""} onChange={(e) => updateExercise(ex, "notes", e.target.value)} />
              </div>
            </div>
          );
        })}
      </div>

      <input
        placeholder="Add new exercise"
        style={{ marginBottom: '1rem', width: '100%' }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addExercise(e.target.value);
            e.target.value = "";
          }
        }}
      />

      <button
        style={{ backgroundColor: '#d6336c', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px' }}
        onClick={() => alert("Progress tracking coming soon!")}
      >
        View Progress (Coming Soon)
      </button>
    </div>
  );
}
