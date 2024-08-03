import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { useEffect } from "react";
import { useState } from "react";
import './node.css';
const DraggableNode = ({
  node,
  id,
  onEdit,
  onDelete,
  isEditMode,
  isDeleteMode,
  nodes,
  setNodes,
  onClick
}) => {
  const {setNodeRef, transform, listeners } = useDraggable({
    id: id,
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      setMousePosition({ x: clientX, y: clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (transform && id) {
      const updatedNodes = nodes.map((node) => {
        if (node.nodeName === id) {
          node.positionX = mousePosition.x;
          node.positionY = mousePosition.y;
        }
        return node;
      });
      setNodes(updatedNodes);
      localStorage.setItem("nodes", JSON.stringify(updatedNodes));
    }
  }, [transform, id, mousePosition, nodes, setNodes]);

  const handleNodeClick = () => {
    onClick(node.nodeName);
  };

  return (
    <g ref={setNodeRef} onClick={handleNodeClick}>
      <circle
        {...listeners}
        cx={node.positionX}
        cy={node.positionY}
        r={50}
        fill={node.backgroundColor}
        style={{ cursor: "pointer" }}
      />
      <text
        x={node.positionX}
        y={node.positionY}
        textAnchor="middle"
        fill="#000"
        style={{ cursor: "pointer" }}
      >
        {node.nodeName}
      </text>
      {isEditMode && (
        <foreignObject
          x={node.positionX -5}
          y={node.positionY -90}
          className="buttonSection"
        >
          <div>
            <button
              className="addEditbtn"
              onClick={() => {
                onEdit(node.nodeName);
              }}
            >
              Edit
            </button>
          </div>
        </foreignObject>
      )}
      {isDeleteMode && (
        <foreignObject
          x={node.positionX -5}
          y={node.positionY -5}
          className="buttonSection"
        >
          <div>
            <button className="addEditbtn" onClick={() => onDelete(node.nodeName)}>
              Delete
            </button>
          </div>
        </foreignObject>
      )}
      {node.linkedNodes !== "" &&
        node.linkedNodes.map((linkedNodeName) => {
          const linkedNode = nodes.find((n) => n.nodeName === linkedNodeName);
          if (linkedNode) {
            const fromX = node.positionX;
            const fromY = node.positionY;
            const toX = linkedNode.positionX;
            const toY = linkedNode.positionY;

            const angle = Math.atan2(toY - fromY, toX - fromX);
            const arrowLength = 10;

            const arrowPoints = [
              [
                toX - arrowLength * Math.cos(angle - Math.PI / 6),
                toY - arrowLength * Math.sin(angle - Math.PI / 6),
              ],
              [
                toX - arrowLength * Math.cos(angle + Math.PI / 6),
                toY - arrowLength * Math.sin(angle + Math.PI / 6),
              ],
              [toX, toY],
            ];

            return (
              <g key={`${node.nodeName}-${linkedNode.nodeName}`}>
                <line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  style={{
                    stroke: "black",
                    strokeWidth: 2,
                    markerEnd: "url(#arrow)",
                  }}
                />
                <polygon
                  points={arrowPoints.map((point) => point.join(",")).join(" ")}
                  fill="black"
                />
              </g>
            );
          }
          return null;
        })}
    </g>
  );
};

export default DraggableNode;
