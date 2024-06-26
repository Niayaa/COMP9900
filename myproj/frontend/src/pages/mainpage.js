import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
} from "@mui/material";

export default function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user_id, user_email, isCustomer, isLoggedIn } = location.state || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [eventType, setEventType] = useState("All");
  const eventTypes = ["All", "Concert", "Live", "Opera", "Comedy"];
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [timeFilter, setTimeFilter] = useState("All");
  const images = [
    "https://lh5.googleusercontent.com/proxy/WOJX-CFnY7iZ1pF22TMJLYuL6ZYqX8nhjrGlMPX8yU6rLDI96t-mRbgVsMCYuS5GkMRxyIONtQi7TBbrb8ukKctjN1oI6XfNABV8ZKt0l7c",
    "https://img95.699pic.com/photo/50133/6436.jpg_wh300.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOd6xvWVOZX6wxp35Y19YuhbxRbyVk_JukPjfismu02A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWqAJMmp6GGGW4SLr_5EjAT4gAe5sTtijMtYdsH16H-g&s",
    "https://img95.699pic.com/photo/50074/8646.jpg_wh300.jpg",

  ];
  useEffect(() => {
    const fetchEvents = async () => {

      const url = "http://127.0.0.1:8000/mainpage/events/filter";

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Event", data);
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };
    fetchEvents();
  }, []);

  const applyFilters = useCallback(() => {
    let result = events;


    if (eventType !== "All") {
      result = result.filter(
        (event) => event.event_type.toLowerCase() === eventType.toLowerCase()
      );
    }


    if (searchTerm) {
      result = result.filter(
        (event) =>
          event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.event_description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }


    const now = new Date();
    switch (timeFilter) {
      case "Today":
        result = result.filter((event) => {
          const eventDate = new Date(event.event_date);
          return eventDate.toDateString() === now.toDateString();
        });
        break;
      case "This month":
        result = result.filter((event) => {
          const eventDate = new Date(event.event_date);
          return (
            eventDate.getMonth() === now.getMonth() &&
            eventDate.getFullYear() === now.getFullYear()
          );
        });
        break;
      case "Next month":
        let nextMonth = now.getMonth() + 1;
        let year = now.getFullYear();
        if (nextMonth > 11) {
          nextMonth = 0;
          year += 1;
        }
        result = result.filter((event) => {
          const eventDate = new Date(event.event_date);
          return (
            eventDate.getMonth() === nextMonth &&
            eventDate.getFullYear() === year
          );
        });
        break;
      default:
        break;
    }

    setFilteredEvents(result);
  }, [events, eventType, searchTerm, timeFilter]);

  const handleTimeFilterChange = (selectedTime) => {
    setTimeFilter(selectedTime);
    applyFilters();
  };

  const handleSearch = () => {
    applyFilters();
  };

  const handleEventTypeClick = (type) => {
    setEventType(type);

    applyFilters();
  };

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleEventClick = (eventid) => {
    navigate("/eventpage", {
      state: {
        ID: eventid.event_id,
        isCustomer: isCustomer,
        user_id: user_id,
        user_email: user_email,
        isLoggedIn: isLoggedIn,
      },
    });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Event slogan sentence
        </Typography>
        <TextField
          label="Search area"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button onClick={handleSearch} variant="contained" sx={{ mb: 2 }}>
          Search button
        </Button>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          {eventTypes.map((type) => (
            <Button
              key={type}
              onClick={() => handleEventTypeClick(type)}
              sx={{ m: 1 }}
            >
              {type}
            </Button>
          ))}
        </Box>
        <Typography variant="h5" gutterBottom>
          Recent Events
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Button
            onClick={() => handleTimeFilterChange("All")}
            variant={timeFilter === "All" ? "contained" : "outlined"}
          >
            All event
          </Button>
          <Button
            onClick={() => handleTimeFilterChange("Today")}
            variant={timeFilter === "Today" ? "contained" : "outlined"}
          >
            Today
          </Button>
          <Button
            onClick={() => handleTimeFilterChange("This month")}
            variant={timeFilter === "This month" ? "contained" : "outlined"}
          >
            This month
          </Button>
          <Button
            onClick={() => handleTimeFilterChange("Next month")}
            variant={timeFilter === "Next month" ? "contained" : "outlined"}
          >
            Next month
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {filteredEvents.map(
            (
              event
            ) => (
              <Button
                key={event.event_id}
                variant="outlined"
                sx={{ height: 150, width: 200 }}
                onClick={() => handleEventClick(event)}
              >
                <Card
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundImage: `url(${
                      images[Math.floor(Math.random() * images.length)]
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: "white",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.9)",
                  }}
                >
                  <CardContent>{event.event_name}</CardContent>
                  <CardContent>
                    {new Date(event.event_date).toLocaleDateString()}
                  </CardContent>
                  {/*  */}
                </Card>
              </Button>
            )
          )}
        </Box>
      </Box>
    </>
  );
}
