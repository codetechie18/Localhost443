import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import StatusBadge from './StatusBadge';

const iconMap = {
  Pending: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
  }),
  'In Progress': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
  }),
  Resolved: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
  }),
};

function MapController({ highlightedComplaint }) {
  const map = useMap();

  useEffect(() => {
    if (!highlightedComplaint) return;
    map.setView([highlightedComplaint.location.lat, highlightedComplaint.location.lng], 15, {
      animate: true,
    });
  }, [highlightedComplaint, map]);

  return null;
}

export default function MapView({ complaints, height = '400px', activeComplaintId }) {
  const activeComplaint = complaints.find((complaint) => complaint.id === activeComplaintId);

  return (
    <div style={{ height }} className="relative rounded-lg overflow-hidden card-shadow">
      <div className="absolute right-4 top-4 z-10 rounded-3xl border border-white/10 bg-slate-950/85 p-4 text-xs text-slate-100 shadow-lg shadow-slate-950/20 backdrop-blur-md">
        <p className="font-semibold text-slate-200">Map legend</p>
        <div className="mt-3 space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" /> Pending
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-yellow-400" /> In Progress
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400" /> Resolved
          </div>
        </div>
      </div>

      <MapContainer center={[21.1458, 79.0882]} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {activeComplaint && <MapController highlightedComplaint={activeComplaint} />}
        {complaints.map((c) => (
          <Marker key={c.id} position={[c.location.lat, c.location.lng]} icon={iconMap[c.status]}>
            <Popup>
              <div className="text-xs space-y-2 min-w-[190px]">
                <p className="font-semibold">{c.title}</p>
                <p>{c.location.address}</p>
                <p>{c.description}</p>
                <p><strong>Department:</strong> {c.department}</p>
                <StatusBadge status={c.status} />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
