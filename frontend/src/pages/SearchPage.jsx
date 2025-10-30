import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Maps from "../components/Maps";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

function SearchPage() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [originCoordinates, setOriginCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Autosuggestion states
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [debouncedOrigin, setDebouncedOrigin] = useState("");
  const [debouncedDestination, setDebouncedDestination] = useState("");

  // Debounce for origin
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedOrigin(formData.from);
    }, 500);

    return () => clearTimeout(handler);
  }, [formData.from]);

  // Debounce for destination
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDestination(formData.to);
    }, 500);

    return () => clearTimeout(handler);
  }, [formData.to]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = async () => {
    if (!formData.from || !formData.to || !formData.date) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/search-rides?from=${formData.from}&to=${formData.to}&date=${formData.date}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data);
        setSearchTriggered(true);
      } else {
  toast.error(data.message || "Erro ao buscar caronas");
      }
    } catch (error) {
      console.error("Error:", error);
  toast.error("Ocorreu um erro ao buscar caronas");
    }
  };

  const handleRequestRide = async (rideId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/request-ride", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shareId: rideId, message: "Requesting this ride" }),
      });
      const data = await response.json();

        if (response.ok) {
        toast.success("Solicitação de carona enviada com sucesso");
      } else {
        toast.error(data.message || "Erro ao enviar solicitação de carona");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ocorreu um erro ao enviar a solicitação de carona");
    }
  };

  const handleSuggestionClick = async (suggestion, type) => {
    const url = new URL(NOMINATIM_BASE_URL);
    url.searchParams.set("q", suggestion.display_name);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        if (type === "origin") {
          setFormData({ ...formData, from: suggestion.display_name });
          setOriginCoordinates([parseFloat(lat), parseFloat(lon)]);
          setOriginSuggestions([]);
        } else if (type === "destination") {
          setFormData({ ...formData, to: suggestion.display_name });
          setDestinationCoordinates([parseFloat(lat), parseFloat(lon)]);
          setDestinationSuggestions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4">
        <h2 className="text-lg font-bold mb-4">Pesquisar caronas</h2>
        <div>
          <label>De</label>
          <input
            type="text"
            name="from"
            value={formData.from}
            onChange={handleChange}
            className="w-full border mb-2 p-2"
            placeholder="Digite um local"
          />
          {originSuggestions.length > 0 && (
            <ul className="bg-white shadow-lg max-h-60 overflow-auto w-full mt-2 rounded-lg z-20">
              {originSuggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSuggestionClick(suggestion, "origin")}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label>Para</label>
          <input
            type="text"
            name="to"
            value={formData.to}
            onChange={handleChange}
            className="w-full border mb-2 p-2"
            placeholder="Digite o destino"
          />
          {destinationSuggestions.length > 0 && (
            <ul className="bg-white shadow-lg max-h-60 overflow-auto w-full mt-2 rounded-lg z-20">
              {destinationSuggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSuggestionClick(suggestion, "destination")}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label>Data</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border mb-4 p-2"
          />
        </div>
        <button
          onClick={handleSearch}
          className="w-full px-5 py-3 text-lg font-semibold text-white bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Buscar
        </button>
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Resultados</h3>
          {searchResults.length > 0 ? (
            searchResults.map((ride, index) => (
              <div key={index} className="border p-2 mb-2">
                <p>Origem: {ride.origin}</p>
                <p>Destino: {ride.destination}</p>
                <p>Data: {new Date(ride.departureTime).toLocaleString()}</p>
                <p>Vagas disponíveis: {ride.spots}</p>
                <p>
                  Motorista: {ride.driver.firstName} {ride.driver.lastName}
                </p>
                <button
                  onClick={() => handleRequestRide(ride.id)}
                  className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                >
                  Solicitar carona
                </button>
              </div>
            ))
          ) : (
            <p>Nenhuma carona encontrada</p>
          )}
        </div>
      </div>
      <div className="flex-1 h-[89vh]">
        <Maps
          originCoordinates={originCoordinates}
          destinationCoordinates={destinationCoordinates}
          searchTriggered={searchTriggered}
        />
      </div>
      <ToastContainer />
    </div>
  );
}

export default SearchPage;