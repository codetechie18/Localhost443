import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
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
    map.flyTo([highlightedComplaint.location.lat, highlightedComplaint.location.lng], 16, {
      animate: true,
      duration: 1.5
    });
  }, [highlightedComplaint, map]);

  return null;
}

export default function MapView({ complaints, height = '400px', activeComplaintId }) {
  const activeComplaint = complaints.find((complaint) => complaint.id === activeComplaintId);

  return (
    <div style={{ height }} className="relative w-full overflow-hidden bg-[#0f172a]">
      <div className="absolute right-4 top-4 z-[400] rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-xs text-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <p className="font-bold text-slate-200 mb-3 tracking-wide uppercase text-[10px]">Map Legend</p>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></div>
            <span className="text-slate-300 font-medium">Pending</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]" /> 
            <span className="text-slate-300 font-medium">In Progress</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" /> 
            <span className="text-slate-300 font-medium">Resolved</span>
          </div>
        </div>
      </div>

      <MapContainer center={[21.1458, 79.0882]} zoom={13} scrollWheelZoom={true} className="h-full w-full z-0" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="bottomright" />
        {activeComplaint && <MapController highlightedComplaint={activeComplaint} />}
        {complaints.map((c) => (
          <Marker key={c.id} position={[c.location.lat, c.location.lng]} icon={iconMap[c.status]}>
            <Popup className="custom-popup">
              <div className="text-sm space-y-2 min-w-[200px] p-1">
                <p className="font-bold text-slate-800 text-base">{c.title}</p>
                <p className="text-slate-500 text-xs">{c.location.address}</p>
                <div className="h-px w-full bg-slate-200 my-2" />
                <p className="text-slate-600 text-sm leading-relaxed">{c.description}</p>
                <p className="text-xs mt-2"><strong className="text-slate-700">Department:</strong> {c.department}</p>
                <div className="mt-3">
                  <StatusBadge status={c.status} />
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
