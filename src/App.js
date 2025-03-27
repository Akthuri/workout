import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Clock, 
  Zap, 
  Shuffle 
} from 'lucide-react';

// Expanded Exercise database
const EXERCISES = {
  strength: [
    { 
      name: 'Push-ups', 
      description: 'Standard chest and arm exercise',
      demoUrl: '/demos/pushups.mp4',
      type: 'bodyweight'
    },
    { 
      name: 'Squats', 
      description: 'Full lower body strength exercise',
      demoUrl: '/demos/squats.mp4',
      type: 'bodyweight'
    },
    { 
      name: 'Lunges', 
      description: 'Leg strength and balance',
      demoUrl: '/demos/lunges.mp4',
      type: 'bodyweight'
    }
  ],
  flexibility: [
    { 
      name: 'Standing Hamstring Stretch', 
      description: 'Stretch back of thighs',
      demoUrl: '/demos/hamstring-stretch.mp4',
      type: 'bodyweight'
    },
    { 
      name: 'Shoulder Rolls', 
      description: 'Upper body mobility',
      demoUrl: '/demos/shoulder-rolls.mp4',
      type: 'bodyweight'
    }
  ],
  cardio: [
    { 
      name: 'Jumping Jacks', 
      description: 'Full body cardio warmup',
      demoUrl: '/demos/jumping-jacks.mp4',
      type: 'bodyweight'
    },
    { 
      name: 'High Knees', 
      description: 'Intense cardio movement',
      demoUrl: '/demos/high-knees.mp4',
      type: 'bodyweight'
    }
  ],
  gym: [
    { 
      name: 'Barbell Bench Press', 
      description: 'Chest and triceps strength exercise',
      demoUrl: '/demos/barbell-bench-press.mp4',
      type: 'weights',
      equipment: 'Barbell'
    },
    { 
      name: 'Deadlift', 
      description: 'Full body strength and posterior chain exercise',
      demoUrl: '/demos/deadlift.mp4',
      type: 'weights',
      equipment: 'Barbell'
    },
    { 
      name: 'Dumbbell Shoulder Press', 
      description: 'Shoulder muscle development',
      demoUrl: '/demos/dumbbell-shoulder-press.mp4',
      type: 'weights',
      equipment: 'Dumbbells'
    },
    { 
      name: 'Leg Press', 
      description: 'Lower body strength training',
      demoUrl: '/demos/leg-press.mp4',
      type: 'machine',
      equipment: 'Leg Press Machine'
    },
    { 
      name: 'Cable Tricep Pushdown', 
      description: 'Targeted tricep isolation exercise',
      demoUrl: '/demos/cable-tricep-pushdown.mp4',
      type: 'machine',
      equipment: 'Cable Machine'
    },
    { 
      name: 'Pull-ups', 
      description: 'Upper body pulling strength',
      demoUrl: '/demos/pull-ups.mp4',
      type: 'bodyweight',
      equipment: 'Pull-up Bar'
    }
  ]
};

const WorkoutGenerator = () => {
  const [duration, setDuration] = useState(5);
  const [category, setCategory] = useState('strength');
  const [workout, setWorkout] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  // Register Service Worker on component mount
  useEffect(() => {
    // Service Worker Registration
    const registerServiceWorker = () => {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
              console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
              console.log('Service Worker registration failed:', error);
            });
        });
      }
    };

    // Register service worker
    registerServiceWorker();

    // Check and update online/offline status
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const generateWorkout = () => {
    const categoryExercises = EXERCISES[category];
    const numExercises = Math.ceil(duration / 2);
    
    const selectedExercises = [];
    for (let i = 0; i < numExercises; i++) {
      const randomExercise = 
        categoryExercises[Math.floor(Math.random() * categoryExercises.length)];
      selectedExercises.push(randomExercise);
    }
    
    setWorkout(selectedExercises);
  };

  useEffect(() => {
    generateWorkout();
  }, [duration, category]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      {isOffline && (
        <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4 text-center">
          You are currently offline. Cached content is available.
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4 text-center">
        Quick Workout Generator
      </h1>
      
      {/* Duration Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          <Clock className="inline mr-2" size={20} />
          Workout Duration
        </label>
        <div className="flex space-x-2">
          {[5, 10, 15].map((time) => (
            <button
              key={time}
              onClick={() => setDuration(time)}
              className={`px-4 py-2 rounded ${
                duration === time 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {time} mins
            </button>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          <Zap className="inline mr-2" size={20} />
          Workout Goal
        </label>
        <div className="flex space-x-2 flex-wrap">
          {Object.keys(EXERCISES).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded capitalize mb-2 ${
                category === cat 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Workout Display */}
      <div className="bg-gray-100 p-4 rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your {duration}-Minute {category} Workout</h2>
          <button 
            onClick={generateWorkout}
            className="bg-purple-500 text-white p-2 rounded"
          >
            <Shuffle size={20} />
          </button>
        </div>

        {workout.map((exercise, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center mb-2 p-2 bg-white rounded"
            onClick={() => setSelectedExercise(exercise)}
          >
            <div>
              <h3 className="font-medium">{exercise.name}</h3>
              <p className="text-sm text-gray-500">
                {exercise.description}
                {exercise.equipment && ` (${exercise.equipment})`}
              </p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        ))}
      </div>

      {/* Exercise Demo Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">{selectedExercise.name}</h2>
            <video 
              src={selectedExercise.demoUrl} 
              controls 
              className="w-full rounded"
            />
            {selectedExercise.equipment && (
              <p className="mt-2 text-sm text-gray-600">
                Equipment: {selectedExercise.equipment}
              </p>
            )}
            <button
              onClick={() => setSelectedExercise(null)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutGenerator;