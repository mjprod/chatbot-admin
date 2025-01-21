export const generateTimestamp = () => {
  const now = new Date();

  const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const time = now.toISOString().split('T')[1].split('Z')[0]; // HH:mm:ss.sss
  const microseconds = String(now.getMilliseconds() * 1000).padStart(6, '0'); // Microseconds

  return `${date}T${time}${microseconds}`;
};

export const calculateTimeDifferences = (messages) => {
  if (!messages.length) return { totalTime: null, lastTime: null };

  const timestamps = messages.map((msg) => new Date(msg.timestamp));
  const now = new Date();

  const firstTimestamp = Math.min(...timestamps);
  const lastTimestamp = Math.max(...timestamps);

  const totalTime = now - firstTimestamp;
  const lastTime = now - lastTimestamp;

  return {
    totalTime: formatTimeToHHMM(totalTime), // Format totalTime to HH:MM
    lastTime: formatTimeToHHMM(lastTime ), // Keep lastTime in seconds for other usage
  };
};

// Helper function to format time to HH:MM
const formatTimeToHHMM = (milliseconds) => {
  const totalMinutes = Math.floor(milliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};