import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

export default function MapView({ complaints, height = '400px', filterStatus }) {
  const filtered = filterStatus ? complaints.filter((c) => c.status === filterStatus) : complaints;

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden card-shadow">
      <MapContainer center={[21.1458, 79.0882]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filtered.map((c) => (
          <Marker key={c.id} position={[c.location.lat, c.location.lng]} icon={iconMap[c.status]}>
            <Popup>
              <div className="text-xs space-y-1 min-w-[180px]">
                <p className="font-semibold">{c.title}</p>
                <p>{c.description}</p>
                <p><strong>Dept:</strong> {c.department}</p>
                <StatusBadge status={c.status} />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
