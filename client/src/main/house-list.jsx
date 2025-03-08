import PropertyCard from '@/components/Property-card'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Propertylist() {
    const [Property, setProperty] = useState([])

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const { data } =await axios.get('http://localhost:5000/api/host/all-items', { 
                    params: { type: 'property' }, 
                    withCredentials: true 
                  });
                  
                setProperty(data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        }
        fetchProperty();
    }, [])

    const handleDelete = (id) => {
        setProperty((prevProperties) => prevProperties.filter((property) => property._id !== id));
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6 gap-6 px-5 p-4">
            {Property.map((Propertys) => (
                <PropertyCard
                    key={Propertys._id}
                    {...Propertys} 
                    images={Propertys.images || []} 
                    country={Propertys.country || "Unknown"}
                    city={Propertys.city || "Unknown"}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    )
}

export default Propertylist;
