import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Map, TrendingUp, Users, AlertCircle, Loader2 } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

interface StateData {
  state: string;
  cases: number;
}

interface HeatmapResponse {
  disease: string;
  data: StateData[];
  total: number;
  states_count: number;
}

// Geographic coordinates for major cities in each state
const stateCoordinates: Record<string, { lat: number; lng: number }> = {
  "Maharashtra": { lat: 19.0760, lng: 72.8777 },
  "Karnataka": { lat: 12.9716, lng: 77.5946 },
  "Tamil Nadu": { lat: 13.0827, lng: 80.2707 },
  "Delhi": { lat: 28.7041, lng: 77.1025 },
  "Gujarat": { lat: 23.0225, lng: 72.5714 },
  "Rajasthan": { lat: 26.9124, lng: 75.7873 },
  "West Bengal": { lat: 22.5726, lng: 88.3639 },
  "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
  "Madhya Pradesh": { lat: 23.2599, lng: 77.4126 },
  "Kerala": { lat: 9.9312, lng: 76.2673 },
  "Punjab": { lat: 31.1471, lng: 75.3412 },
  "Haryana": { lat: 28.4595, lng: 77.0266 },
  "Bihar": { lat: 25.5941, lng: 85.1376 },
  "Andhra Pradesh": { lat: 16.5062, lng: 80.6480 },
  "Telangana": { lat: 17.3850, lng: 78.4867 },
  "Odisha": { lat: 20.2961, lng: 85.8245 },
  "Assam": { lat: 26.1445, lng: 91.7362 },
  "Jharkhand": { lat: 23.3441, lng: 85.3096 },
  "Chhattisgarh": { lat: 21.2514, lng: 81.6296 },
  "Uttarakhand": { lat: 30.0668, lng: 79.0193 }
};

function HeatmapLayer({ data }: { data: StateData[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !data.length) return;

    // Create heatmap data points [lat, lng, intensity]
    const heatData: [number, number, number][] = data
      .map((item) => {
        const coords = stateCoordinates[item.state];
        if (!coords) return null;
        const intensity = item.cases / 50; // Increased intensity (lower divisor)
        return [coords.lat, coords.lng, intensity] as [number, number, number];
      })
      .filter((point): point is [number, number, number] => point !== null);

    // Create heatmap layer with much more visible settings
    const heat = (L as any).heatLayer(heatData, {
      radius: 60,        // Larger radius for more visibility
      blur: 45,          // More blur for smoother gradient
      maxZoom: 10,
      max: 10.0,         // Lower max for more intense colors
      minOpacity: 0.6,   // Minimum opacity to ensure visibility
      gradient: {
        0.0: 'rgba(0, 0, 255, 0)',      // Transparent blue
        0.2: 'rgba(0, 100, 255, 0.8)',  // Light blue
        0.4: 'rgba(0, 200, 255, 0.9)',  // Cyan
        0.6: 'rgba(255, 255, 0, 0.9)',  // Yellow
        0.8: 'rgba(255, 150, 0, 1)',    // Orange
        1.0: 'rgba(255, 0, 0, 1)'       // Red
      }
    }).addTo(map);

    // Add clean circular markers with tooltips
    data.forEach((item) => {
      const coords = stateCoordinates[item.state];
      if (coords) {
        // Determine color based on cases
        let markerColor = '#3b82f6'; // blue
        if (item.cases >= 1000) markerColor = '#ef4444'; // red
        else if (item.cases >= 600) markerColor = '#f97316'; // orange
        else if (item.cases >= 300) markerColor = '#eab308'; // yellow

        const marker = L.circleMarker([coords.lat, coords.lng], {
          radius: 8,
          fillColor: markerColor,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        });

        // Add tooltip on hover
        marker.bindTooltip(
          `<div style="text-align: center;">
            <strong style="font-size: 13px;">${item.state}</strong><br/>
            <span style="font-size: 12px;">${item.cases} cases</span>
          </div>`,
          {
            direction: 'top',
            permanent: false,
            className: 'custom-tooltip'
          }
        );

        marker.addTo(map);
      }
    });

    return () => {
      map.eachLayer((layer) => {
        if (layer !== map) {
          map.removeLayer(layer);
        }
      });
    };
  }, [map, data]);

  return null;
}

const Heatmap = () => {
  const [selectedDisease, setSelectedDisease] = useState("Acne");
  const [heatmapData, setHeatmapData] = useState<StateData[]>([]);
  const [totalCases, setTotalCases] = useState(0);
  const [loading, setLoading] = useState(true);

  const diseases = ["Acne", "Eczema", "Psoriasis", "Rosacea", "Melanoma", "Vitiligo", "Dermatitis"];

  useEffect(() => {
    fetchHeatmapData(selectedDisease);
  }, [selectedDisease]);

  const fetchHeatmapData = async (disease: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost/skin-health-hub-main/skin-health-hub-main/api/heatmap/stats.php?disease=${disease}`);
      const data: HeatmapResponse = await response.json();
      setHeatmapData(data.data);
      setTotalCases(data.total);
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
    } finally {
      setLoading(false);
    }
  };

  const mostAffected = heatmapData.length > 0 ? heatmapData.reduce((max, state) => state.cases > max.cases ? state : max, heatmapData[0]) : null;
  const avgCases = heatmapData.length > 0 ? Math.round(totalCases / heatmapData.length) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Disease Heatmap</h1>
              <p className="text-muted-foreground">
                Visualize skin disease occurrence patterns across India
              </p>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                <SelectTrigger>
                  <SelectValue placeholder="Select disease" />
                </SelectTrigger>
                <SelectContent>
                  {diseases.map((disease) => (
                    <SelectItem key={disease} value={disease}>
                      {disease}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <p className="text-3xl font-bold">{totalCases.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Across {heatmapData.length} states</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Most Affected Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : mostAffected ? (
                      <>
                        <p className="text-2xl font-bold">{mostAffected.state}</p>
                        <p className="text-xs text-muted-foreground">{mostAffected.cases} cases</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No data</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average per State
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <p className="text-3xl font-bold">{avgCases}</p>
                        <p className="text-xs text-muted-foreground">cases per state</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaflet Map Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                India Disease Heatmap - {selectedDisease}
              </CardTitle>
              <CardDescription>
                Geographic distribution of {selectedDisease} cases across India
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {/* Leaflet Map Container */}
                  <div className="w-full h-[500px] rounded-lg border overflow-hidden">
                    <MapContainer
                      center={[22.5, 79]}
                      zoom={5}
                      style={{ height: "100%", width: "100%" }}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <HeatmapLayer data={heatmapData} />
                    </MapContainer>
                  </div>

                  {/* Heatmap Legend */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-semibold mb-3">Heat Intensity Legend</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Low</span>
                      <div className="flex-1 h-4 rounded" style={{
                        background: "linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)"
                      }}></div>
                      <span className="text-xs">High</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Color intensity indicates case density. Red = highest, Blue = lowest
                    </p>
                  </div>

                  {/* Data Table */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">State-wise Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {[...heatmapData].sort((a, b) => b.cases - a.cases).map((item, index) => (
                        <div
                          key={item.state}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {index + 1}
                            </div>
                            <span className="font-medium">{item.state}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{item.cases}</span>
                            <span className="text-sm text-muted-foreground">cases</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Info Note */}
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>Note:</strong> This interactive heatmap shows the geographic distribution of {selectedDisease} cases across India.
                      The heat intensity and color represent the concentration of cases in each region. Click and drag to pan, scroll to zoom.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
