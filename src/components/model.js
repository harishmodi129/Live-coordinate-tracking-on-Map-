import React, { useState } from "react";

import { getDistance } from "ol/sphere"; // For calculating distances between coordinates

const MissionCreationModal = ({
  isOpen,
  allLines,
  onClose,
  onGenerate,
  onInsertPolygon,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const toggleDropdown = (lineIndex, rowIndex) => {
    const dropdownId = `${lineIndex}-${rowIndex}`;
    setDropdownVisible((prev) => (prev === dropdownId ? null : dropdownId));
  };

  // Calculate distances between waypoints for each line
  const calculateDistances = (coordinates) => {
    const distances = [];
    for (let i = 0; i < coordinates.length - 1; i++) {
      const distance = getDistance(
        [coordinates[i][0], coordinates[i][1]], // Lon, Lat of first point
        [coordinates[i + 1][0], coordinates[i + 1][1]] // Lon, Lat of next point
      );
      distances.push(distance.toFixed(2)); // Store distance in meters, rounded to 2 decimals
    }
    distances.unshift("--"); // First point doesn't have a distance
    return distances;
  };

  if (!isOpen) return null;

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
          width: "700px",
          maxHeight: "500px",
          overflowY: "auto",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ✖
        </button>
        <h3>Mission Creation</h3>
        {allLines.length === 0 ? (
          <p>Click on the map to create a route and press ↵ to complete.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f9f9f9" }}>
                <th style={{ textAlign: "center", padding: "8px" }}>WP</th>
                <th style={{ textAlign: "center", padding: "8px" }}>
                  Coordinates
                </th>
                <th style={{ textAlign: "center", padding: "8px" }}>
                  Distance (m)
                </th>
                <th style={{ textAlign: "center", padding: "8px" }}>Options</th>
              </tr>
            </thead>
            <tbody>
              {allLines.map((line, lineIndex) => {
                const distances = calculateDistances(line.coordinates); // Calculate distances for this line

                return line.coordinates.map((coord, rowIndex) => (
                  <tr key={`${lineIndex}-${rowIndex}`}>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      {`${lineIndex}-${rowIndex}`}
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
                      {distances[rowIndex]} {/* Display calculated distance */}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        borderBottom: "1px solid #e0e0e0",
                        position: "relative",
                      }}
                    >
                      <button
                        onClick={() => toggleDropdown(lineIndex, rowIndex)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      >
                        ⋮
                      </button>
                      {dropdownVisible === `${lineIndex}-${rowIndex}` && (
                        <div
                          style={{
                            position: "absolute",
                            top: "30px",
                            right: "0",
                            background: "white",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                            zIndex: 10,
                          }}
                        >
                          <button
                            onClick={() =>
                              onInsertPolygon(lineIndex, rowIndex, "before")
                            }
                            style={{
                              display: "block",
                              width: "100%",
                              textAlign: "left",
                              padding: "10px",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Insert Polygon Before
                          </button>
                          <button
                            onClick={() =>
                              onInsertPolygon(lineIndex, rowIndex, "after")
                            }
                            style={{
                              display: "block",
                              width: "100%",
                              textAlign: "left",
                              padding: "10px",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Insert Polygon After
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        )}
        <button
          onClick={onGenerate}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#6c63ff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Generate Data
        </button>
      </div>
    </div>
  );
};

export default MissionCreationModal;
