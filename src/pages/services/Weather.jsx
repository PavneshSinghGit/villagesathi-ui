import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  CloudSun, Droplets, Wind, Thermometer,
  Sun, CloudRain, MapPin,
  Info, AlertCircle, Calendar, Sunrise, Sunset, Search
} from "lucide-react";
import "../../styles/servicesStyles.css";

function Weather() {
  const [city, setCity] = useState("Lucknow");

  // Mock Data
  const currentWeatherData = {
    temp: "32°C",
    condition: "Partly Cloudy",
    humidity: "65%",
    windSpeed: "12 km/h",
    feelsLike: "35°C",
    sunrise: "5:30 AM",
    sunset: "6:45 PM"
  };

  const forecast = [
    { day: "Tomorrow", temp: "31°C", icon: <CloudRain className="text-info" /> },
    { day: "Wednesday", temp: "33°C", icon: <Sun className="text-warning" /> },
    { day: "Thursday", temp: "30°C", icon: <CloudSun className="text-primary" /> },
    { day: "Friday", temp: "29°C", icon: <CloudRain className="text-info" /> },
  ];

  return (
    <div className="weather-page py-5 bg-light min-vh-100">
      <Helmet>
        <title>Weather Updates | Real-time Forecast | VillageSathi</title>
      </Helmet>

      <div className="container">
        {/* --- TOP SECTION: SEARCH & CURRENT WEATHER --- */}
        <div className="row mb-5 align-items-center">
          
          {/* Left Side: Search & Text */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h1 className="fw-bold display-4 mb-3 text-dark">Weather Forecast 🌦️</h1>
            <p className="lead text-muted mb-4">
              Get accurate real-time weather updates for your village or district.
              Plan your agricultural activities with our reliable 5-day forecast.
            </p>

            <div className="search-box">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="row g-2">
                  <div className="col-md-8 col-12">
                    <div className="position-relative">
                      <MapPin
                        size={20}
                        className="position-absolute text-success"
                        style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: '5' }}
                      />
                      <input
                        type="text"
                        className="form-control ps-5 py-3 shadow-sm border-2"
                        placeholder="Enter city or district name..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ borderRadius: '15px', borderColor: '#dee2e6' }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-12">
                    <button
                      className="btn btn-success w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center"
                      style={{ borderRadius: '15px' }}
                    >
                      <Search size={20} className="me-2" /> Check Status
                    </button>
                  </div>
                </div>
              </form>
              <small className="text-muted ms-2 mt-2 d-block">
                <Info size={14} className="me-1" /> Type your District name for best results.
              </small>
            </div>
          </div>

          {/* Right Side: Dashboard Card */}
          <div className="col-lg-6">
            <div className="main-weather-card p-4 p-md-5 rounded-5 shadow-lg text-white" 
                 style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-start">
                  <p className="mb-0 opacity-75 fw-bold text-uppercase tracking-wider">Live Weather</p>
                  <h2 className="display-2 fw-bold mb-0">{currentWeatherData.temp}</h2>
                  <p className="fs-4 mb-0 font-italic">{currentWeatherData.condition}</p>
                </div>
                <CloudSun size={80} strokeWidth={1.5} className="text-warning" />
              </div>

              <div className="row text-center mt-5 pt-4 border-top border-white border-opacity-25">
                <div className="col-4 border-end border-white border-opacity-10">
                  <Droplets size={24} className="mb-1 text-info mx-auto" />
                  <p className="small mb-0 opacity-75">Humidity</p>
                  <p className="fw-bold mb-0">{currentWeatherData.humidity}</p>
                </div>
                <div className="col-4 border-end border-white border-opacity-10">
                  <Wind size={24} className="mb-1 text-light mx-auto" />
                  <p className="small mb-0 opacity-75">Wind</p>
                  <p className="fw-bold mb-0">{currentWeatherData.windSpeed}</p>
                </div>
                <div className="col-4">
                  <Thermometer size={24} className="mb-1 text-danger mx-auto" />
                  <p className="small mb-0 opacity-75">Feels</p>
                  <p className="fw-bold mb-0">{currentWeatherData.feelsLike}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: FORECAST & SIDEBAR --- */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <h4 className="fw-bold mb-4 d-flex align-items-center">
                <Calendar className="me-2 text-success" /> 5-Day Forecast
              </h4>
              <div className="row g-3">
                {forecast.map((f, i) => (
                  <div className="col-6 col-sm-3 text-center" key={i}>
                    <div className="p-3 border rounded-4 transition-hover bg-light">
                      <p className="text-muted small mb-2 fw-bold text-uppercase">{f.day}</p>
                      <div className="mb-2">{f.icon}</div>
                      <h5 className="fw-bold mb-0">{f.temp}</h5>
                    </div>
                  </div>
                ))}
              </div>

              {/* Farmer Advisory */}
              <div className="mt-4 p-4 rounded-4 border-start border-4 border-warning bg-warning bg-opacity-10">
                <div className="d-flex align-items-center mb-2 text-dark">
                  <AlertCircle className="me-2" size={24} />
                  <h5 className="fw-bold mb-0">Agricultural Advisory</h5>
                </div>
                <p className="mb-0 text-dark opacity-75">
                  <strong>Rainfall Alert:</strong> Light rainfall expected within 48 hours.
                  Suspend irrigation for paddy crops. Apply fertilizers only when the sky is clear.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Solar Details */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center text-dark">
                <Info size={20} className="text-primary me-2" /> Day Cycle
              </h5>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <Sunrise size={20} className="text-warning me-2" />
                  <span className="text-muted">Sunrise:</span>
                </div>
                <span className="fw-bold">{currentWeatherData.sunrise}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Sunset size={20} className="text-danger me-2" />
                  <span className="text-muted">Sunset:</span>
                </div>
                <span className="fw-bold">{currentWeatherData.sunset}</span>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-success text-white">
              <h5 className="fw-bold mb-2">Smart Farming Tip</h5>
              <p className="small mb-0 opacity-90 leading-relaxed">
                Rainwater is rich in nitrogen. Use it wisely for Kharif crops, but ensure 
                proper drainage to avoid root rot during heavy showers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;