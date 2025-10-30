import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Maps from "../components/Maps";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

const ShareForm = () => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
    departureTime: "",
    spots: "",
    message: "",
  });

  const [originCoordinates, setOriginCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

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

  const handleSearchClick = () => {
    if (formData.from && formData.to) {
      setSearchTriggered(true);
    } else {
      alert("Por favor, selecione origem e destino");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/create-trip",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

  toast.success("Viagem compartilhada com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log("Trip created:", response.data);
    } catch (error) {
      console.error("Error creating trip:", error);
  toast.error("Falha ao criar viagem. Por favor, tente novamente.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="flex justify-start p-8 space-x-4">
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-8 rounded-lg w-96 shadow-md">
        <div>
          <label className="block text-gray-700">De</label>
          <input
            type="text"
            name="from"
            value={formData.from}
            onChange={handleChange}
            placeholder="Digite o nome de um local"
            className="w-full p-2 mt-1 border rounded-md"
          />
          {originSuggestions.length > 0 && (
            <ul className="bg-white shadow-lg max-h-60 overflow-auto w-full mt-2 rounded-lg z-20">
              {originSuggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setFormData({ ...formData, from: suggestion.display_name });
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
        <div>
          <label className="block text-gray-700">Para</label>
          <input
            type="text"
            name="to"
            value={formData.to}
            onChange={handleChange}
            placeholder="Digite o nome de um local"
            className="w-full p-2 mt-1 border rounded-md"
          />
          {destinationSuggestions.length > 0 && (
            <ul className="bg-white shadow-lg max-h-60 overflow-auto w-full mt-2 rounded-lg z-20">
              {destinationSuggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setFormData({ ...formData, to: suggestion.display_name });
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
        <div>
          <label className="block text-gray-700">Partida</label>
          <div className="flex space-x-2">
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              className="w-1/2 p-2 border rounded-md"
            />
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              className="w-1/2 p-2 border rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Vagas no seu carro</label>
          <input
            type="number"
            name="spots"
            value={formData.spots}
            onChange={handleChange}
            placeholder="Número de vagas"
            className="w-full p-2 mt-1 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700">Mensagem</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Mensagem..."
            className="w-full p-2 mt-1 border rounded-md"
          />
        </div>
        <button
          type="button"
          onClick={handleSearchClick}
          className="w-full px-5 py-3 text-lg font-semibold text-white bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
          Buscar
        </button>
        <button
          type="submit"
          className="w-full px-5 py-3 text-lg font-semibold text-white bg-black rounded-lg shadow-lg hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Compartilhar
        </button>
      </form>

      <div className="flex-1 h-[86vh]">
        <Maps
          originCoordinates={originCoordinates}
          destinationCoordinates={destinationCoordinates}
          searchTriggered={searchTriggered}
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default ShareForm;