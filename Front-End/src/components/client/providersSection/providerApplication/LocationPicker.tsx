import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L, { LatLng, Marker as LeafletMarker } from "leaflet";
import { autoCompleteSearch, forwardGeocode, reverseGeocode } from "@/utils/helper/olaGeocoding";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


interface LocationPickerProps {
  open: boolean;
  onClose: () => void;
  onSave: (location: { lat: number; lng: number; address: string }) => void;
}

// -----------------------------------------------------------------------------
// FIX: Leaflet default marker icons DO NOT load in Vite (React + TS) because
// Vite changes file paths during bundling. Leaflet looks for icons at paths
// that no longer exist, so markers disappear or show broken images.
//
// To fix this:
// 1) We remove Leaflet's internal _getIconUrl method so it does NOT try
//    to load the default (wrong) image paths.
// 2) Then we manually provide CORRECT paths using import.meta.url,
//    which Vite resolves properly in dev and production.
// -----------------------------------------------------------------------------
delete (L.Icon.Default.prototype as unknown as Partial<{ _getIconUrl: string }>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
});
// -----------------------------------------------------------------------------

interface Suggestion {
  description: string;
}

export default function LocationPicker({ open, onClose, onSave }: LocationPickerProps) {

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // ----------------------------
  // Get Current Location
  // ----------------------------
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        console.log("Accuracy:", pos.coords.accuracy);

        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });

        const addr = await reverseGeocode(latitude, longitude);
        // console.log("use crcnt location on button click ", addr);
        setAddress(addr);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  };

  // ----------------------------
  // Autocomplete Search
  // ----------------------------
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await autoCompleteSearch(query);

      // Type-safe mapping
      const mapped: Suggestion[] = res.map((x: any) => ({
        description: x.description,
      }));

      setSuggestions(mapped);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // ----------------------------
  // Choose place from suggestions
  // ----------------------------
  const choosePlace = async (address: string) => {
    const results = await forwardGeocode(address);
    console.log("choosePlace", results);
    if (results.length > 0) {
      const loc = results[0];
      setPosition({ lat: loc.lat, lng: loc.lng });
      setAddress(loc.address);
    }

    setSuggestions([]);
    setQuery(address);
  };

  // ----------------------------
  // Reverse geocode when marker moves
  // ----------------------------
  useEffect(() => {
    if (!position) return;
    const fetchAddress = async () => {
      const addr = await reverseGeocode(position.lat, position.lng);
      console.log("default location ", addr);
      setAddress(addr);
    };
    fetchAddress();
  }, [position]);

  // ----------------------------
  // Draggable Marker Component
  // ----------------------------
  const DraggableMarker = () => {

    const markerRef = useRef<LeafletMarker | null>(null);
    const { lat, lng } = position!;
    useMapEvents({
      click(e) {
        setPosition({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });

    return (
      <Marker
        draggable={true}
        position={[lat, lng]}
        ref={markerRef}
        eventHandlers={{
          dragend() {
            const marker = markerRef.current;
            if (marker) {
              const newPos: LatLng = marker.getLatLng();
              setPosition({ lat: newPos.lat, lng: newPos.lng });
            }
          },
        }}
      />
    );
  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative bg-white rounded-lg p-4 w-full max-w-4xl shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-black font-roboto ">Select Location</h2>
          <button onClick={onClose}>✖</button>
        </div>

        {/* Search Box */}
        <Input
          className="w-full border-1 p-2 border-black/40 rounded mb-2"
          placeholder="Search location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="border bg-white rounded shadow p-2 max-h-40 overflow-auto">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => choosePlace(s.description)}
              >
                {s.description}
              </div>
            ))}
          </div>
        )}

        {/* Map */}
        <div className="h-80 mt-3">
          <MapContainer
            center={position ? [position.lat, position.lng] : [20.5937, 78.9629]}
            zoom={position ? 25 : 5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {position && <DraggableMarker />}
          </MapContainer>
        </div>

        {/* Address */}
        <p className="mt-2 text-sm text-gray-700 font-roboto">{address}</p>

        {/* Buttons */}
        <div className="flex gap-2 justify-end mt-4">
          <Button
            onClick={getCurrentLocation}
            className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 "
          >
            Use Current Location
          </Button>

          <Button
            disabled={!position}
            variant={"success"}
            onClick={() => position && onSave({ ...position, address })}
            className=" "

          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
