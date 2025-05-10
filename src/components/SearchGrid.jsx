import React, { useState } from "react";
import axios from "axios";
import "./SearchGrid.css";

const tabs = ["Stays", "Flights", "Cars", "Packages", "Things to do", "Cruises"];

// Cities data with their codes
const cities = [
  { name: "New York", code: "NYC" },
  { name: "London", code: "LON" },
  { name: "Paris", code: "PAR" },
  { name: "Tokyo", code: "TYO" },
  { name: "Dubai", code: "DXB" },
  { name: "Singapore", code: "SIN" },
  { name: "Los Angeles", code: "LAX" },
  { name: "Hong Kong", code: "HKG" },
  { name: "Sydney", code: "SYD" },
  { name: "Rome", code: "ROM" },
  { name: "Bangkok", code: "BKK" },
  { name: "Amsterdam", code: "AMS" },
  { name: "Mumbai", code: "BOM" },
  { name: "Shanghai", code: "SHA" },
  { name: "Istanbul", code: "IST" }
];
const airlines = {
  AA: "American Airlines",
  AC: "Air Canada",
  AF: "Air France",
  AI: "Air India",
  AM: "Aeromexico",
  AR: "Aerolineas Argentinas",
  AS: "Alaska Airlines",
  AY: "Finnair",
  AZ: "ITA Airways",
  BA: "British Airways",
  BR: "EVA Air",
  CA: "Air China",
  CX: "Cathay Pacific",
  CZ: "China Southern",
  DL: "Delta Air Lines",
  EK: "Emirates",
  ET: "Ethiopian Airlines",
  EY: "Etihad Airways",
  FI: "Icelandair",
  FJ: "Fiji Airways",
  GA: "Garuda Indonesia",
  IB: "Iberia",
  JL: "Japan Airlines",
  JJ: "LATAM Airlines Brazil",
  KA: "Cathay Dragon",
  KE: "Korean Air",
  KL: "KLM Royal Dutch Airlines",
  KM: "Air Malta",
  KQ: "Kenya Airways",
  LA: "LATAM Airlines",
  LH: "Lufthansa",
  LO: "LOT Polish Airlines",
  LX: "Swiss International Air Lines",
  LY: "El Al Israel Airlines",
  MH: "Malaysia Airlines",
  MK: "Air Mauritius",
  MS: "EgyptAir",
  NH: "All Nippon Airways",
  NZ: "Air New Zealand",
  OS: "Austrian Airlines",
  OZ: "Asiana Airlines",
  PG: "Bangkok Airways",
  PR: "Philippine Airlines",
  QR: "Qatar Airways",
  QF: "Qantas",
  RJ: "Royal Jordanian",
  SA: "South African Airways",
  SK: "Scandinavian Airlines",
  SQ: "Singapore Airlines",
  SU: "Aeroflot",
  SV: "Saudia",
  TG: "Thai Airways",
  TK: "Turkish Airlines",
  TP: "TAP Air Portugal",
  TU: "Tunisair",
  UA: "United Airlines",
  UL: "SriLankan Airlines",
  UX: "Air Europa",
  VN: "Vietnam Airlines",
  VS: "Virgin Atlantic",
  WS: "WestJet",
  WY: "Oman Air",
  XQ: "SunExpress"
};
const getAirlineName = (code) => airlines[code] || code || 'N/A';

const SearchGrid = () => {
  const [activeTab, setActiveTab] = useState("Flights");
  const [results, setResults] = useState(null);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    dateRange: '',
    adults: 1,
  });

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
    setResults(null);
    console.log("Switched to tab:", tab);
  };

  const handleCitySearch = (value, type) => {
    const searchTerm = value.toLowerCase();
    const filteredCities = cities.filter(city => 
      city.name.toLowerCase().includes(searchTerm) || 
      city.code.toLowerCase().includes(searchTerm)
    );

    if (type === 'from') {
      setFromSuggestions(filteredCities);
      setShowFromSuggestions(true);
    } else {
      setToSuggestions(filteredCities);
      setShowToSuggestions(true);
    }
  };

  const handleCitySelect = (city, type) => {
    if (type === 'from') {
      setFormData(prev => ({ ...prev, from: city.code }));
      setShowFromSuggestions(false);
    } else {
      setFormData(prev => ({ ...prev, to: city.code }));
      setShowToSuggestions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'from') {
      handleCitySearch(value, 'from');
    } else if (name === 'to') {
      handleCitySearch(value, 'to');
    }
  };

  const handleSubmit = async () => {
    if (activeTab !== "Flights") {
      console.log("Search not implemented for tab:", activeTab);
      return;
    }

    const { from, to, dateRange, adults } = formData;
    console.log("Form Data before API call:", formData);

    // Validate required fields
    if (!from || !to || !dateRange) {
      console.log("Missing required fields:", { from, to, dateRange });
      return;
    }

    const form = new URLSearchParams();
    form.append('originLocationCode', from);
    form.append('destinationLocationCode', to);
    form.append('departureDate', dateRange);
    form.append('adults', adults);
    form.append('max', 5);
    form.append('currencyCode', 'USD');

    console.log("API Request URL:", 'http://localhost:3008/api/user/flightOffers');
    console.log("API Request Data:", Object.fromEntries(form));

    try {
      console.log("Making API call...");
      const res = await axios.post('http://localhost:3008/api/user/flightOffers', form, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log("API Response:", res.data);
      const flightOffers = res.data.data?.data;
      console.log("Flight Results:", flightOffers);
      setResults(flightOffers);
    } catch (error) {
      console.error("Error fetching flights:", error);
      console.error("Error details:", error.response?.data || error.message);
    }
  };

  const renderSearchFields = () => {
    switch (activeTab) {
      case "Stays":
        return (
          <>
            <input type="text" placeholder="Going to" />
            <input type="text" placeholder="Check-in - Check-out" />
            <input type="text" placeholder="2 adults, 1 room" />
          </>
        );
      case "Flights":
        return (
          <>
            <div className="city-input-container">
              <input
                type="text"
                name="from"
                placeholder="From"
                value={formData.from}
                onChange={handleChange}
                onFocus={() => setShowFromSuggestions(true)}
              />
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <div className="city-suggestions">
                  {fromSuggestions.map((city, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleCitySelect(city, 'from')}
                    >
                      {city.name} ({city.code})
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="city-input-container">
              <input
                type="text"
                name="to"
                placeholder="To"
                value={formData.to}
                onChange={handleChange}
                onFocus={() => setShowToSuggestions(true)}
              />
              {showToSuggestions && toSuggestions.length > 0 && (
                <div className="city-suggestions">
                  {toSuggestions.map((city, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleCitySelect(city, 'to')}
                    >
                      {city.name} ({city.code})
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="text"
              name="dateRange"
              placeholder="Departure Date (YYYY-MM-DD)"
              value={formData.dateRange}
              onChange={handleChange}
            />
            <input
              type="number"
              name="adults"
              placeholder="Adults"
              min="1"
              value={formData.adults}
              onChange={handleChange}
            />
          </>
        );
      case "Cars":
        return (
          <>
            <input type="text" placeholder="Pick-up location" />
            <input type="text" placeholder="Pick-up - Drop-off dates" />
          </>
        );
      default:
        return (
          <>
            <input type="text" placeholder={`Search ${activeTab.toLowerCase()}...`} />
          </>
        );
    }
  };

  return (
    <div className="search-grid">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => handleActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="search-bar">
        {renderSearchFields()}
        <button className="search-btn" onClick={handleSubmit}>
          Search
        </button>
      </div>

      {activeTab === "Packages" && (
        <div className="extras">
          <label><input type="checkbox" /> Add a flight</label>
          <label><input type="checkbox" /> Add a car</label>
        </div>
      )}

      {activeTab === "Flights" && Array.isArray(results) && results.length > 0 ? (
        <div className="flight-cards">
          {results.map((offer, idx) => (
            <div className="flight-card" key={idx}>
              <div className="flight-card-header">
                <img src="/assets/img/plane1.png" alt="Plane" className="airline-logo" style={{width: 48, height: 48}} />
                <span className="flight-price">
                  {offer.price?.total ? `$${offer.price.total} ${offer.price.currency || 'USD'}` : 'N/A'}
                </span>
              </div>
              <div className="flight-card-body">
  {offer.itineraries && offer.itineraries[0] && offer.itineraries[0].segments && offer.itineraries[0].segments[0] ? (
    <>
      <div>
        <strong>{offer.itineraries[0].segments[0].departure.iataCode}</strong> → <strong>{offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1].arrival.iataCode}</strong>
      </div>
      <div>
        {offer.itineraries[0].segments[0].departure.at ? new Date(offer.itineraries[0].segments[0].departure.at).toLocaleString() : ''}
        {" - "}
        {offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1].arrival.at ? new Date(offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1].arrival.at).toLocaleString() : ''}
      </div>
      <div>Duration: {offer.itineraries[0].duration ? offer.itineraries[0].duration.replace('PT', '').toLowerCase() : 'N/A'}</div>
      <div>Stops: {offer.itineraries[0].segments.length - 1}</div>
      <div>
        Airline: {getAirlineName(offer.itineraries[0].segments[0].carrierCode)}
      </div>
      <div>
        Operated By: {getAirlineName(offer.itineraries[0].segments[0].operating?.carrierCode)}
      </div>
    </>
  ) : (
    <div>No itinerary data</div>
  )}
  <div>Class: {offer.travelerPricings && offer.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || 'N/A'}</div>
  <div>Baggage: {offer.travelerPricings && offer.travelerPricings[0]?.fareDetailsBySegment[0]?.includedCheckedBags?.quantity ? `${offer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity} checked` : 'N/A'}</div>
</div>

              <div className="flight-card-footer">
                <button>Book Now</button>
              </div>
            </div>
          ))}
        </div>
      ) : results && activeTab === "Flights" ? (
        <p>No flight offers available.</p>
      ) : null}
    </div>
  );
};

export default SearchGrid;
