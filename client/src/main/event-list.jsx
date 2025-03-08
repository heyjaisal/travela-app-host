import EventCard from '@/components/Event-cards'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Eventlist() {
    const [event, setEvent] = useState([])

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } =await axios.get('http://localhost:5000/api/host/all-items', { 
                    params: { type: 'events' }, 
                    withCredentials: true 
                  });
                  
                setEvent(data);
            } catch (error) {
                console.error("Error fetching Events:", error);
            }
        }
        fetchEvent();
    }, [])

    const handleDelete = (id) => {
        setProperty((prevProperties) => prevProperties.filter((property) => property._id !== id));
    };

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
    )
}

export default Eventlist;
