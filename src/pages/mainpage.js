import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

export default function MainPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const eventTypes = ["All", "Concert", "Live", "Opear", "Comedy"];
  const [events, setEvents] = useState([
    // 假设这里是你所有的事件数据
    {
      ConcertTitle: "TAYLOR SWIFT | THE ERAS TOUR",
      Date: "THUR, MAR 7, 2024",
      type: "Concert",
      id: 1,
    },
    // 添加更多的事件
    {
      ConcertTitle: "ED SHEERAN | + - = ÷ x TOUR",
      Date: "SAT, APR 10, 2024",
      type: "Live",
      id: 2,
    },
    {
      ConcertTitle: "BILLIE EILISH | HAPPIER THAN EVER TOUR",
      Date: "FRI, MAY 15, 2024",
      type: "Concert",
      id: 3,
    },
    {
      ConcertTitle: "OPERA EVENT",
      Date: "WED, MAY 20, 2024",
      type: "Concert",
      id: 4,
    },
    // ...其他事件
  ]);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [timeFilter, setTimeFilter] = useState("All");
  const handleTimeFilterChange = (selectedTime) => {
    setTimeFilter(selectedTime);
    let newFilteredEvents;
    const now = new Date();

    switch (selectedTime) {
      case "Today":
        newFilteredEvents = events.filter((event) => {
          const eventDate = new Date(event.Date);
          return (
            eventDate.getDate() === now.getDate() &&
            eventDate.getMonth() === now.getMonth() &&
            eventDate.getFullYear() === now.getFullYear()
          );
        });
        break;
      case "This month":
        newFilteredEvents = events.filter((event) => {
          const eventDate = new Date(event.Date);
          return (
            eventDate.getMonth() === now.getMonth() &&
            eventDate.getFullYear() === now.getFullYear()
          );
        });
        break;
      case "Next month":
        const nextMonth = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
        const year =
          now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
        newFilteredEvents = events.filter((event) => {
          const eventDate = new Date(event.Date);
          return (
            eventDate.getMonth() === nextMonth &&
            eventDate.getFullYear() === year
          );
        });
        break;
      case "All":
      default:
        newFilteredEvents = events;
    }

    setFilteredEvents(newFilteredEvents);
  };
  const handleSearch = () => {
    const filtered = events.filter((event) =>
      event.ConcertTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleEventTypeClick = (type) => {
    if (type === "All") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) => event.type === type);
      setFilteredEvents(filtered);
    }
  };

  const handleEventClick = (event) => {
    navigate("/eventpage", { state: [event] }); // 将对象包装在数组中
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
              event // 遍历filteredEvents来渲染每个事件的按钮
            ) => (
              <Button
                key={event.id}
                variant="outlined"
                sx={{ height: 150, width: 200 }}
                onClick={() => handleEventClick(event)} // 传递当前事件对象给handleEventClick
              >
                <Card sx={{ width: "100%", height: "100%" }}>
                  <CardContent>{event.ConcertTitle}</CardContent>
                  <CardContent>{event.Date}</CardContent>
                  {/* 使用事件标题 */}
                </Card>
              </Button>
            )
          )}
        </Box>
      </Box>
    </>
  );
}
