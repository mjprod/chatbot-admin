import { useState } from "react";
import { SERVER } from "../utils/constants";

// Custom hook for making API requests using fetch
const useApiRequest = () => {
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track API errors
  const [response, setResponse] = useState(null); // Store API responses
  const [success, setSuccess] = useState(null); // Track request success
  const FIXED_TOKEN = "4d4a50524f4432303232";




  // Core fetch function for API requests
  const fetchData = async (config) => {
    const { url, method = "GET", headers, body } = config;

    try {
      setLoading(true);
      setError(null); // Reset errors on new request
      setSuccess(null); // Reset success status

      const authHeaders = {
        "Content-Type": "application/json",
        Authorization: `Token ${FIXED_TOKEN}`,
        ...headers,
      };

      // Perform the fetch request
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: body ? JSON.stringify(body) : null,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data); // Store successful response
      setSuccess(true); // Mark request as successful

      return { success: true, data }; // Return structured success object
    } catch (err) {
      console.error("API Error:", error);
      setError(err.message); // Capture and store error message
      setSuccess(false); // Mark request as failed

      return { success: false, error: err.message }; // Return structured error object
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };



  // Function to send feedback to the API
  const saveFeedback = async (feedback, language) => {

    if (typeof language !== "string" || !language) {
      console.error("Invalid language value:", language);
      return;
    }

    const config = {
      url: SERVER + `api/capture_feedback_multi/?language=${language}`,
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: feedback,
    };

    return await fetchData(config); // Return result to caller
  };

  // Expose states and API functions to components
  return {
    loading,
    error,
    response,
    success,
    fetchData,
    saveFeedback,
  };
};

export default useApiRequest;
