import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ServiceList.css";
import {ChevronLeft, ChevronRight} from "lucide-react";
const ServiceList = () => {
    const [services, setServices] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/api/services/");
                setServices(data);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchServices();
    }, []);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    return (
        <div className="services-section">
            <h2 className="section-title">Commercial Services</h2>
            <p className="section-description">
                Our team is dedicated to creating beautiful landscapes and meticulously 
                caring for them with unmatched services.
            </p>

          
            <div className="service-container" ref={scrollRef}>
            <button onClick={scrollLeft} className="scroll-btn left"><ChevronLeft size={24} /></button>
                {services.map((service) => (
                    
                    <div key={service._id} className="service-card">
                        <img src={`http://localhost:5000${service.imageUrl}`} alt={service.name} />
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                        <a href={service.moreInfo} target="_blank" rel="noopener noreferrer">
                            ➜ Read More
                        </a>
                    </div>
                ))}
                <button onClick={scrollRight} className="scroll-btn right"><ChevronRight size={24}/></button>
            </div>
        </div>
    );
};

export default ServiceList;
