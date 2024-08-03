import React, { useEffect, useState } from "react";
import NodesForm from "../addEdit_form/addEditForm";
import { DndContext } from "@dnd-kit/core";
import DraggableNode from "../node/node";
import './canvas.css';
const Canvas = () => {
  const [nodes, setNodes] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isShowPopup, setShowPopup] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isRelationMood,setRelationMood] = useState(false);
  

  useEffect(() => {
    const savedNodes = JSON.parse(localStorage.getItem("nodes")) || [];
    setNodes(savedNodes);
  }, []);
  
  const editNode = (nodeName) => {
    const nodeToEdit = nodes.find((node) => node.nodeName === nodeName);
    setSelectedNode(nodeToEdit);
    setShowPopup(true);
  };

  const deleteNode = (nodeName) => {
    const updatedNodes = nodes.filter((node) => node.nodeName !== nodeName);
    const updatedNodesWithRemovedLinks = updatedNodes.map((node) => {
      if (node.linkedNodes !== "") {
        const updatedLinkedNodes = node.linkedNodes.filter(
          (linkedNodeName) => linkedNodeName !== nodeName
        );
        return {
          ...node,
          linkedNodes: updatedLinkedNodes,
        };
      } else {
        return node; 
      }
    });

    localStorage.setItem("nodes", JSON.stringify(updatedNodesWithRemovedLinks));

    setNodes(updatedNodesWithRemovedLinks);
  };

  const openPopUp = () => {
    setShowPopup(true);
  };

  const addNode = (newNode) => {
    const existingNodeIndex = nodes.findIndex(
      (node) => node.nodeName === newNode.nodeName
    );
    if (existingNodeIndex !== -1) {
      const updatedNodes = [...nodes];
      updatedNodes[existingNodeIndex] = newNode;
      setNodes(updatedNodes);
    } else {
      setNodes((prevNodes) => [...prevNodes, newNode]);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleNodeClick = (nodeName) => {
    if (isRelationMood) {
      if (selectedNode) {
        const clickedNode = nodes.find((node) => node.nodeName === nodeName);
        if (clickedNode && !clickedNode.linkedNodes.includes(selectedNode.nodeName)) {
          const updatedClickedNode = {
            ...clickedNode,
            linkedNodes: [...clickedNode.linkedNodes, selectedNode.nodeName],
          };
          const updatedNodes = nodes.map((node) =>
            node.nodeName === nodeName ? updatedClickedNode : node
          );
          setNodes(updatedNodes);
          localStorage.setItem("nodes", JSON.stringify(updatedNodes)); 
        }
        setSelectedNode(null);
      } else {
        const clickedNode = nodes.find((node) => node.nodeName === nodeName);
        setSelectedNode(clickedNode);
      }
    } else {
      const clickedNode = nodes.find((node) => node.nodeName === nodeName);
      setSelectedNode(clickedNode);
    }
  };


  return (
    <div className="container">
      <div className="buttonSection">
        <button className="btn" onClick={openPopUp}>
          Add Node
        </button>
        <button className="btn" onClick={() => setIsEditMode(!isEditMode)}>
          {isEditMode ? 'Disable Edit Mode' : 'Enable Edit Mode'}
        </button>
        <button className="btn" onClick={() => setIsDeleteMode(!isDeleteMode)}>
          {isDeleteMode ? 'Disable Delete Mode' : 'Enable Delete Mode'}
        </button>
        <button className="btn" onClick={() => setRelationMood(!isRelationMood)}>
          {isRelationMood ? 'Disable Relation Mode' : 'Enable Relation Mode'}
        </button>
      </div>
      {isShowPopup && (
        <NodesForm
          onClose={handleClose}
          open={isShowPopup}
          onAddNode={addNode}
          nodeData={selectedNode}
          isEditMode = {isEditMode}
        />
      )}
      <svg width="100%" height="1000vh">
        <DndContext>
          {nodes.map((node) => (
            <DraggableNode
              id={node.nodeName}
              onEdit={editNode}
              onDelete={deleteNode}
              isEditMode={isEditMode}
              isDeleteMode={isDeleteMode}
              node={node}
              nodes={nodes}
              setNodes={setNodes}
              onClick={handleNodeClick}
            />
          ))}
          <defs>
            <marker
              id="arrow"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#000" />
            </marker>
          </defs>
        </DndContext>
      </svg>
    </div>
  );
};

export default Canvas;
