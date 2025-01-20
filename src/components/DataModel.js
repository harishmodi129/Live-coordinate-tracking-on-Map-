import React from "react";
import { getDistance } from "ol/sphere"; // Import distance calculation function

const MissionPlannerModal = ({
  isOpen,
  polygonCoordinates,
  onDiscard,
  onImport,
}) => {
  if (!isOpen) return null;

  // Function to calculate distances between consecutive coordinates
  const calculateDistances = (coordinates) => {
    const distances = [];
    for (let i = 0; i < coordinates.length - 1; i++) {
      const distance = getDistance(
        [coordinates[i][0], coordinates[i][1]], // Longitude, Latitude of the first point
        [coordinates[i + 1][0], coordinates[i + 1][1]] // Longitude, Latitude of the next point
      );
      distances.push(distance.toFixed(2)); // Store distance in meters (rounded to 2 decimals)
    }
    distances.unshift("--"); // Add "--" for the first point as it has no preceding distance
    return distances;
  };

  // Calculate distances for the given polygonCoordinates
  const distances = polygonCoordinates.length
    ? calculateDistances(polygonCoordinates)
    : [];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "600px",
          maxHeight: "400px",
          overflowY: "auto",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h3>Polygon Tool</h3>
        {polygonCoordinates.length === 0 ? (
          <div>
            <p style={{ marginBottom: "20px" }}>
              Click on the map to mark points of the polygon's perimeter, then
              press ↵ to close and complete the polygon.
            </p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={onDiscard}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ff6f61",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Discard
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c63ff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "not-allowed",
                }}
                disabled
              >
                Import Points
              </button>
            </div>
          </div>
        ) : (
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th>WP</th>
                  <th>Coordinates</th>
                  <th>Distance (m)</th>
                </tr>
              </thead>
              <tbody>
                {polygonCoordinates.map((coord, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      {index.toString().padStart(2, "0")}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      {coord[0].toFixed(6)}, {coord[1].toFixed(6)}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      {distances[index]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button
                onClick={onDiscard}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ff6f61",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Discard
              </button>
              <button
                onClick={onImport}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c63ff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Import Points
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionPlannerModal;
