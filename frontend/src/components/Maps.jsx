/* eslint-disable react/prop-types */
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";

const AnimatePanToOrigin = ({ originCoordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (originCoordinates && Array.isArray(originCoordinates)) {
      const [lat, lng] = originCoordinates;
      if (!isNaN(lat) && !isNaN(lng)) {
        map.setView(originCoordinates, 11, { animate: true });
      } else {
        console.error("Invalid origin coordinates:", originCoordinates);
      }
    }
  }, [map, originCoordinates]);

  return null;
};

const RoutingControl = ({
  originCoordinates,
  destinationCoordinates,
  searchTriggered,
}) => {
  const map = useMap();

  useEffect(() => {
    if (
      searchTriggered &&
      originCoordinates &&
      destinationCoordinates &&
      Array.isArray(originCoordinates) &&
      Array.isArray(destinationCoordinates)
    ) {
      const [originLat, originLng] = originCoordinates;
      const [destLat, destLng] = destinationCoordinates;

      if (
        !isNaN(originLat) &&
        !isNaN(originLng) &&
        !isNaN(destLat) &&
        !isNaN(destLng)
      ) {
        const routingControl = L.Routing.control({
          waypoints: [
            L.latLng(originLat, originLng),
            L.latLng(destLat, destLng),
          ],
          routeWhileDragging: false,
          createMarker: () => null, // Remove markers if you don't want them

          lineOptions: {
            styles: [{ color: '#4285F4', opacity: 0.7, weight: 9 }], // Customize the path color and style
          },

        }).addTo(map);

        // Cleanup
        return () => map.removeControl(routingControl);
      } else {
        console.error("Invalid coordinates for routing.");
      }
    }
  }, [map, originCoordinates, destinationCoordinates, searchTriggered]);

  return null;
};

const Maps = ({ originCoordinates, destinationCoordinates, searchTriggered }) => {
  const defaultPosition = [28.613939, 77.209023];

  return (
    <div className="w-full h-full">
      <MapContainer center={defaultPosition} zoom={15} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {originCoordinates && (
          <Marker position={originCoordinates}>
            <Popup>Origin</Popup>
          </Marker>
        )}
        {destinationCoordinates && (
          <Marker position={destinationCoordinates}>
            <Popup>Destination</Popup>
          </Marker>
        )}
        <AnimatePanToOrigin originCoordinates={originCoordinates} />
        <RoutingControl
          originCoordinates={originCoordinates}
          destinationCoordinates={destinationCoordinates}
          searchTriggered={searchTriggered}
        />
      </MapContainer>
    </div>
  );
};

export default Maps;