import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const polygonPath = [
  { lat: 43.765, lng: -79.496 },
  { lat: 43.780, lng: -79.347 },
  { lat: 43.706, lng: -79.341 },
  { lat: 43.676, lng: -79.489 },
];

const center = { lat: 43.725, lng: -79.415 };
const origin = { lat: 43.7256, lng: -79.4028 };

let mapsScriptPromise: Promise<any> | null = null;

function loadGoogleMaps() {
  if (window.google?.maps) return Promise.resolve(window.google);
  if (mapsScriptPromise) return mapsScriptPromise;

  mapsScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return mapsScriptPromise;
}

export const GoogleDeliveryMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string>("Enter your address to check if you're inside the delivery area.");
  const [statusTone, setStatusTone] = useState<"neutral" | "good" | "bad">("neutral");
  const [ready, setReady] = useState(false);
  const markerRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);

  const statusClass = useMemo(() => {
    if (statusTone === "good") return "text-green-800 bg-green-50 border-green-200";
    if (statusTone === "bad") return "text-red-800 bg-red-50 border-red-200";
    return "text-muted-foreground bg-secondary/40 border-border/50";
  }, [statusTone]);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || !mapRef.current || !inputRef.current) return;

    let mounted = true;

    loadGoogleMaps()
      .then((google) => {
        if (!mounted || !mapRef.current || !inputRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 11,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
        });

        mapInstanceRef.current = map;

        polygonRef.current = new google.maps.Polygon({
          paths: polygonPath,
          strokeColor: "#4E8A67",
          strokeOpacity: 0.95,
          strokeWeight: 3,
          fillColor: "#7DB58A",
          fillOpacity: 0.25,
        });
        polygonRef.current.setMap(map);

        new google.maps.Marker({
          position: origin,
          map,
          title: "Yonge & Lawrence area",
        });

        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "ca" },
          fields: ["formatted_address", "geometry", "name"],
          types: ["address"],
        });

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          if (!place?.geometry?.location) {
            setStatus("We couldn't read that address. Try selecting one from the dropdown.");
            setStatusTone("bad");
            return;
          }

          const location = place.geometry.location;
          const inside = google.maps.geometry.poly.containsLocation(location, polygonRef.current);

          if (!markerRef.current) {
            markerRef.current = new google.maps.Marker({ map });
          }

          markerRef.current.setPosition(location);
          map.panTo(location);
          map.setZoom(13);

          if (inside) {
            setStatus(`Good news, ${place.formatted_address || place.name} looks inside our current delivery area.`);
            setStatusTone("good");
          } else {
            setStatus(`Sorry, ${place.formatted_address || place.name} looks outside our current delivery area. If you're near the edge, contact us to double-check.`);
            setStatusTone("bad");
          }
        });

        setReady(true);
      })
      .catch(() => {
        setStatus("The delivery map couldn't load right now.");
        setStatusTone("bad");
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-6 text-muted-foreground">
        Google Maps key not configured yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-soft">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <Input ref={inputRef} placeholder="Enter your address to check delivery" />
          <Button type="button" variant="outline" onClick={() => inputRef.current?.focus()}>
            {ready ? "Search address" : "Loading map..."}
          </Button>
        </div>
        <div className={`rounded-xl border px-4 py-3 text-sm ${statusClass}`}>
          {status}
        </div>
      </div>
      <div ref={mapRef} className="h-[520px] w-full rounded-2xl border border-border/50 shadow-soft" />
    </div>
  );
};
