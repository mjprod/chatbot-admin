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
  const formattedTimestamps = formatTimeToDDMMYY(lastTimestamp);
  

  return {
    totalTime: formatTimeToHHMM(totalTime),
    lastTime: formatTimeToHHMM(lastTime ),
    formatted: (formattedTimestamps)
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

const formatTimeToDDMMYY = (milliseconds) => {
  const date = new Date(milliseconds);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12; // Convert to 12-hour format

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};