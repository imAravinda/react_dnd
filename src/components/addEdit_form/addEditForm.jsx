import {
  Button,
  Chip,
  Dialog,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";

const NodesForm = (props) => {
  const [nodeName, setNodeName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [positionX, setPositionX] = useState("");
  const [positionY, setPositionY] = useState("");
  const [linkedNodes, setLinkedNodes] = useState([]);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [existingNodes, setExistingNodes] = useState([]);

  useEffect(() => {
    const nodesFromStorage = JSON.parse(localStorage.getItem("nodes")) || [];
    setExistingNodes(nodesFromStorage);
    if (props.nodeData && props.isEditMode) {
      setNodeName(props.nodeData.nodeName);
      setBackgroundColor(props.nodeData.backgroundColor);
      setPositionX(props.nodeData.positionX);
      setPositionY(props.nodeData.positionY);
      setLinkedNodes(props.nodeData.linkedNodes);
      setAdditionalDetails(props.nodeData.additionalDetails);
    }
  }, [props]);

  const handleSave = () => {
    const newNode = {
      nodeName,
      backgroundColor,
      positionX,
      positionY,
      linkedNodes,
      additionalDetails,
    };
    const existingNodeIndex = existingNodes.findIndex((node) => node.nodeName === nodeName);
    if (existingNodeIndex !== -1) {
      const updatedNodes = [...existingNodes];
      updatedNodes[existingNodeIndex] = newNode;
  
      localStorage.setItem("nodes", JSON.stringify(updatedNodes));
      props.onAddNode(newNode); 
    } else {
      const updatedNodes = [...existingNodes, newNode];
      localStorage.setItem("nodes", JSON.stringify(updatedNodes));
      props.onAddNode(newNode); 
    }
  
    props.onClose(); 
  };
  
  

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <TextField
            id="filled-basic"
            label="Node Name"
            variant="filled"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            sx={{ margin: "10%" }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            sx={{ margin: "10%" }}
            id="filled-basic"
            label="Background Color"
            variant="filled"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="filled-basic"
            label="Position(X)"
            variant="filled"
            value={positionX}
            onChange={(e) => setPositionX(e.target.value)}
            sx={{ margin: "10%" }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="filled-basic"
            label="Position(Y)"
            variant="filled"
            value={positionY}
            onChange={(e) => setPositionY(e.target.value)}
            sx={{ margin: "10%" }}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl
            variant="filled"
            sx={{ m: 1, width: "25ch", margin: "10%" }}
          >
            <InputLabel id="demo-simple-select-filled-label">
              Select Linked Nodes
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={linkedNodes}
              onChange={(e) => {
                const selectedNode = existingNodes.find(node => node.nodeName === e.target.value);
                if (!linkedNodes.includes(selectedNode.nodeName)) {
                  setLinkedNodes((prevLinkedNodes) => [...prevLinkedNodes, selectedNode.nodeName]);
                }
              }}
              
            >
              {existingNodes.map((node) => (
                <MenuItem key={node.nodeName} value={node.nodeName}>{node.nodeName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="filled-multiline-static"
            label=""
            multiline
            rows={4}
            defaultValue=""
            variant="filled"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            sx={{ margin: "10%" }}
            InputProps={{
              startAdornment: linkedNodes.map((node, index) => (
                <Chip
                  key={index}
                  label={node}
                  onDelete={() => {
                    const updatedNodes = [...linkedNodes];
                    updatedNodes.splice(index, 1);
                    setLinkedNodes(updatedNodes);
                  }}
                />
              ))
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            sx={{ margin: "10%" }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default NodesForm;
