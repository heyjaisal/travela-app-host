import EventCard from "@/components/Event-cards";
import { useOnceEffect } from "@/hooks/useeffectOnce";
import axios from "axios";
import React, { useState } from "react";
import { Circles } from "react-loader-spinner";

function Eventlist() {
  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState(false);

  useOnceEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/listing/all-items",
          {
            params: { type: "events" },
            withCredentials: true,
          }
        );

        setEvent(data);
      } catch (error) {
        console.error("Error fetching Events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  });

  const handleDelete = (id) => {
    setProperty((prevProperties) =>
      prevProperties.filter((property) => property._id !== id)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Circles
          height="50"
          width="50"
          color="#4fa94d"
          ariaLabel="loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6 gap-6 px-5 p-4">
      {event.map((events) => (
        <EventCard
          key={events._id}
          {...events}
          images={events.images || []}
          country={events.country || "Unknown"}
          city={events.city || "Unknown"}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default Eventlist;
