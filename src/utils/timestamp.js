export const generateTimestamp = () => {
  const now = new Date();

  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = now.toISOString().split("T")[1].split("Z")[0]; // HH:mm:ss.sss
  const microseconds = String(now.getMilliseconds() * 1000).padStart(6, "0"); // Microseconds

  return `${date}T${time}${microseconds}`;
};
