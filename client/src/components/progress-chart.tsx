import { useMemo } from "react";

interface ProgressChartProps {
  data: Array<{
    mood: string;
    intensity: number;
    createdAt: string;
  }>;
}

export function ProgressChart({ data }: ProgressChartProps) {
  const weeklyData = useMemo(() => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1];
      
      // Find mood entries for this day
      const dayEntries = data.filter(entry => {
        const entryDate = new Date(entry.createdAt);
        return entryDate.toDateString() === date.toDateString();
      });

      // Calculate average intensity for the day
      const averageIntensity = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + entry.intensity, 0) / dayEntries.length
        : 0;

      weekData.push({
        day: dayName,
        intensity: averageIntensity,
        hasData: dayEntries.length > 0
      });
    }

    return weekData;
  }, [data]);

  const getMoodColor = (intensity: number) => {
    if (intensity >= 4.5) return 'bg-[hsl(48,100%,67%)]'; // Joy
    if (intensity >= 3.5) return 'bg-[hsl(197,71%,73%)]'; // Calm
    if (intensity >= 2.5) return 'bg-[hsl(0,0%,88%)]'; // Neutral
    if (intensity >= 1.5) return 'bg-[hsl(349,100%,85%)]'; // Stressed
    return 'bg-[hsl(277,60%,85%)]'; // Anxious
  };

  return (
    <div className="pt-4 border-t border-gray-100">
      <p className="text-sm text-gray-600 mb-3">This week's mood trend</p>
      <div className="flex items-end justify-between space-x-1 h-16">
        {weeklyData.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className={`w-full rounded-t transition-all duration-300 ${
                day.hasData ? getMoodColor(day.intensity) : 'bg-gray-200'
              }`}
              style={{ 
                height: day.hasData ? `${Math.max(8, (day.intensity / 5) * 64)}px` : '8px'
              }}
            />
            <span className="text-xs text-gray-500 mt-1">{day.day}</span>
          </div>
        ))}
      </div>
      
      {weeklyData.every(day => !day.hasData) && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No mood data for this week</p>
          <p className="text-xs text-gray-400">Start tracking your mood to see trends</p>
        </div>
      )}
    </div>
  );
}
