"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MapViewProps {
  listings: {
    id: string;
    title: string;
    location: string;
    lat: number;
    lng: number;
  }[];
}

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView({ listings }: MapViewProps) {
  if (!listings || listings.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        No locations available to display on the map 📍
      </p>
    );
  }

  // Default to first listing if available
  const center = [listings[0].lat, listings[0].lng] as [number, number];

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.lat, listing.lng]}
            icon={markerIcon}
          >
            <Popup>
              <strong>{listing.title}</strong>
              <br />
              {listing.location}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
