import { useState } from "react";
import axios from "axios";

const ConnectStripe = () => {
  const [loading, setLoading] = useState(false);

  const connectStripe = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/connect-stripe", {}, { withCredentials: true });
      window.location.href = res.data.url; // Redirect to Stripe onboarding
    } catch (error) {
      console.error("Stripe Connection Failed", error);
    }
    setLoading(false);
  };

  return (
    <button onClick={connectStripe} disabled={loading}>
      {loading ? "Connecting..." : "Connect Stripe"}
    </button>
  );
};

export default ConnectStripe;
