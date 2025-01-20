import React, { useEffect, useRef, useState } from "react";
import MissionCreationModal from "../components/model";
import MissionPlannerModal from "../components/DataModel";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { Draw } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";

const MapComponent = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const drawInteraction = useRef(null);
  const polygonInteraction = useRef(null);

  const [allLines, setAllLines] = useState([]); // Stores LineString data
  const [polygonCoordinates, setPolygonCoordinates] = useState([]); // Stores Polygon coordinates
  const [isMissionCreationOpen, setIsMissionCreationOpen] = useState(false); // Mission Creation modal state
  const [isMissionPlannerOpen, setIsMissionPlannerOpen] = useState(false); // Mission Planner modal state

  useEffect(() => {
    if (!mapInstance.current) {
      const source = new VectorSource();
      const vectorLayer = new VectorLayer({ source });

      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2,
        }),
      });

      // Initialize draw interactions for LineString and Polygon
      drawInteraction.current = new Draw({ source, type: "LineString" });
      polygonInteraction.current = new Draw({ source, type: "Polygon" });

      // Handle LineString drawing completion
      drawInteraction.current.on("drawend", (event) => {
        const geometry = event.feature.getGeometry();
        const coords = geometry.getCoordinates();
        setAllLines((prev) => [
          ...prev,
          { coordinates: coords, distances: [] },
        ]);
      });

      // Handle Polygon drawing completion
      polygonInteraction.current.on("drawend", (event) => {
        const geometry = event.feature.getGeometry();
        setPolygonCoordinates(geometry.getCoordinates()[0]); // Extract outer ring of the polygon
        setIsMissionPlannerOpen(true); // Open Mission Planner modal
        mapInstance.current.removeInteraction(polygonInteraction.current); // Remove Polygon interaction after drawing
      });
    }
  }, []);

  const openMissionPlanner = () => {
    setIsMissionPlannerOpen(true); // Ensure the modal is shown
    mapInstance.current.addInteraction(polygonInteraction.current); // Enable Polygon drawing
  };

  const handleInsertPolygon = (lineIndex, rowIndex, position) => {
    if (polygonCoordinates.length > 0) {
      setAllLines((prevLines) => {
        const updatedLines = [...prevLines];
        const line = updatedLines[lineIndex];
        if (position === "before") {
          line.coordinates.splice(rowIndex, 0, ...polygonCoordinates);
        } else {
          line.coordinates.splice(rowIndex + 1, 0, ...polygonCoordinates);
        }
        return updatedLines;
      });
      setPolygonCoordinates([]); // Clear polygon coordinates after insertion
    }
  };

  return (
    <div>
      <button onClick={() => setIsMissionCreationOpen(true)}>
        Draw Mission
      </button>
      <button onClick={openMissionPlanner}>Draw Polygon</button>

      {/* Mission Creation Modal */}
      <MissionCreationModal
        isOpen={isMissionCreationOpen}
        allLines={allLines}
        onClose={() => setIsMissionCreationOpen(false)}
        onInsertPolygon={handleInsertPolygon}
        onGenerate={() => {
          mapInstance.current.addInteraction(drawInteraction.current); // Enable LineString drawing
        }}
      />

      {/* Mission Planner Modal */}
      <MissionPlannerModal
        isOpen={isMissionPlannerOpen}
        polygonCoordinates={polygonCoordinates}
        onDiscard={() => {
          setPolygonCoordinates([]); // Clear polygon coordinates
          setIsMissionPlannerOpen(false); // Close the modal
        }}
        onImport={() => {
          if (polygonCoordinates.length > 0) {
            setAllLines((prev) => [
              ...prev,
              { coordinates: polygonCoordinates, distances: [] },
            ]);
          }
          setPolygonCoordinates([]); // Clear polygon coordinates
          setIsMissionPlannerOpen(false); // Close the modal
        }}
      />

      {/* Map Container */}
      <div
        ref={mapRef}
        style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
      ></div>
    </div>
  );
};

export default MapComponent;
