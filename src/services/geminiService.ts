
import { Activity, AIInsight } from "../types";

/**
 * A enhanced mock service that simulates different AI "observations" 
 * based on the volume of logged activities.
 */
export const analyzeActivities = async (activities: Activity[]): Promise<AIInsight | null> => {
  if (activities.length === 0) return null;

  // Simulate network latency for realism
  await new Promise(resolve => setTimeout(resolve, 1800));

  const count = activities.length;

  // High activity volume (Busy/Productive day)
  if (count >= 6) {
    return {
      summary: "Your day is remarkably dense with activity. You've maintained a high-output rhythm, but the density suggests you might be nearing a cognitive threshold.",
      suggestions: [
        "Schedule a 'zero-input' window of 15 minutes to clear mental cache.",
        "Prioritize one high-impact task for the next hour and defer the rest.",
        "Ensure you're hydrating; high-density schedules often lead to neglected basics."
      ]
    };
  }

  // Moderate activity volume (Balanced flow)
  if (count >= 3) {
    const variants = [
      {
        summary: "You've established a consistent and healthy flow. Your cadence between events shows intentionality and focus.",
        suggestions: [
          "This is your peak performance window. Tackle your hardest problem now.",
          "Document one small win from the morning to boost afternoon morale.",
          "Check your posture—reset your shoulders and neck before the next log."
        ]
      },
      {
        summary: "A balanced start to the day. You are navigating between tasks with enough breathing room to maintain quality.",
        suggestions: [
          "Consider a short walk to consolidate the learning from your last task.",
          "Prepare your environment for the next transition.",
          "Reflect on if the current 'time' of these events matches your natural energy."
        ]
      }
    ];
    return variants[Math.floor(Math.random() * variants.length)];
  }

  // Low activity volume (Just starting or quiet day)
  return {
    summary: "The day is still in its formative stages. This is the 'quiet before the storm'—a perfect time for strategic intent.",
    suggestions: [
      "Define the 'one thing' that would make today a success.",
      "Check in with your energy levels: Are you fueled for the afternoon?",
      "Set a reminder for a mindful transition into your next big block of work."
    ]
  };
};
