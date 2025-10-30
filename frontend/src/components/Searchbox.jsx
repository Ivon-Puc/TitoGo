import React, { useState, useEffect } from "react";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

const Searchbox = ({setOriginCoordinates, setDestinationCoordinates, setSearchTriggered}) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [debouncedOrigin, setDebouncedOrigin] = useState("");
  const [debouncedDestination, setDebouncedDestination] = useState("");

  // Debounce for origin
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedOrigin(origin); 
    }, 500); 

    return () => clearTimeout(handler); 
  }, [origin]);

  // Debounce for destination
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDestination(destination); 
    }, 500); 

    return () => clearTimeout(handler); 
  }, [destination]);

  // Fetch suggestions
  const fetchSuggestions = async (query, type) => {
    if (!query) {
      if (type === "origin") setOriginSuggestions([]);
      if (type === "destination") setDestinationSuggestions([]);
      return;
    }

    const url = new URL(NOMINATIM_BASE_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (type === "origin") {
        setOriginSuggestions(data);
      } else if (type === "destination") {
        setDestinationSuggestions(data);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Fetch origin suggestions whenever debouncedOrigin changes
  useEffect(() => {
    fetchSuggestions(debouncedOrigin, "origin");
  }, [debouncedOrigin]);

  // Fetch destination suggestions whenever debouncedDestination changes
  useEffect(() => {
    fetchSuggestions(debouncedDestination, "destination");
  }, [debouncedDestination]);

  const handleOriginChange = (e) => {
    setOrigin(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleSearchClick = () => {
    if(origin && destination){
      setSearchTriggered(true);
    } else {
      alert("Por favor, selecione origem e destino")
    }
  }

  return (
    <div className="flex flex-col items-start p-6 space-y-6 bg-gray-100 shadow-lg w-96 fixed top-0 left-0 h-full">
      <h2 className="text-2xl font-bold">Exibir rota</h2>

      {/* for Origin Input */}
      <div className="flex flex-col w-full space-y-4">
        <label htmlFor="origin" className="text-lg font-medium text-gray-700">
          Origem
        </label>
        <input
          type="text"
          id="origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Digite a origem"
          className="px-5 py-3 text-lg border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none border-gray-300"
        />
        {originSuggestions.length > 0 && (
          <ul className="bg-white shadow-lg max-h-60 overflow-auto w-full mt-2 rounded-lg z-20">
            {originSuggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setOrigin(suggestion.display_name);
                  setOriginCoordinates([suggestion.lat, suggestion.lon]);
                  setOriginSuggestions([]);
                }}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* for Destination Input */}
      <div className="flex flex-col w-full space-y-4">
        <label
          htmlFor="destination"
          className="text-lg font-medium text-gray-700"
        >
          Destino
        </label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Digite o destino"
          className="px-5 py-3 text-lg border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none border-gray-300"
        />
        {destinationSuggestions.length > 0 && (
          <ul className="bg-white shadow-lg max-h-60 overflow-auto w-full mt-2 rounded-lg z-20">
            {destinationSuggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setDestination(suggestion.display_name);
                  setDestinationCoordinates([suggestion.lat, suggestion.lon]);
                  setDestinationSuggestions([]);
                }}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={handleSearchClick} className="w-full px-5 py-3 text-lg text-white bg-blue-600 rounded-lg shadow hover:bg-blue-800 focus:ring-2 focus:ring-blue-400 focus:outline-none">
        Buscar
      </button>
    </div>
  );
};

export default Searchbox;