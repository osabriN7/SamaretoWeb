import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import mf from "diagram-library";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import "../../styles/DiagramStyle/ToolBar.css";
import PopUp from "./PopUp";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function ToolBar({ diagram }) {
  const classes = useStyles();
  const [link, setLink] = useState("");
  const [modelFile, setModelFile] = useState();
  const [index, setIndex] = useState(-1);



  const onSelectedLinkTypeChanged = (event) => {
    setLink(event.target.value);
    diagram.state.diagram.setLinkShape(event.target.value);

    if (event.target.value === 2) diagram.state.diagram.setRouteLinks(true);
    else diagram.state.diagram.setRouteLinks(false);
  };

  const onUndo = () => {

    diagram.state.diagram.undo();
    diagram.setState({ matrix: diagram.getMatrix() })
    diagram.setState({ treeData: diagram.getDiagramJson() });
  };

  const onRedo = () => {
    diagram.state.diagram.redo();
    diagram.setState({ matrix: diagram.getMatrix() });
    diagram.setState({ treeData: diagram.getDiagramJson() });
  };

  const onZoomOutClicked = (e) => {
    var zoom = diagram.state.diagram.getZoomFactor();

    zoom -= 10;
    if (zoom > 10) diagram.state.diagram.setZoomFactor(zoom);
  };

  const onZoomInClicked = (e) => {
    var zoom = diagram.state.diagram.getZoomFactor();

    zoom += 10;
    if (zoom < 500) diagram.state.diagram.setZoomFactor(zoom);
  };

  const onSaveModel = (e) => {
    diagram.setState({downloadTriggerPopUp:false, uploadTriggerPopUp: false, saveFilePopUp:true, trigger: true });
  }
  const onLockClicked = (event) => {
    var mydiagram = diagram.state.diagram;
    var selectedItems = mydiagram.getSelection().nodes;
    var listChilds = [];
    var listLinks = [];
    if (selectedItems.length > 0) {
      var selectedNode = selectedItems[0];

      /*  if (
        selectedNode.getEnabledHandles() !==
        mf.Diagramming.AdjustmentHandles.None
      )
        selectedNode.setEnabledHandles(mf.Diagramming.AdjustmentHandles.None);
      else selectedNode.setEnabledHandles(mf.Diagramming.AdjustmentHandles.All);
    }*/
      listChilds = selectedNode.getChildren();

      if (listChilds.length > 0 && listChilds[0].getVisible()) {
        listChilds.forEach((item) => {
          var links = item.getAllLinks();
          links.forEach((link) => {
            link.setVisible(false);
          });
          item.setVisible(false);
        });
      } else if (listChilds.length > 0) {
        listChilds.forEach((item) => {
          var links = item.getAllLinks();
          links.forEach((link) => {
            link.setVisible(true);
          });
          item.setVisible(true);
        });
      } else {
        return;
      }
    }
  };
  const onUploadTriggerPopUp = () => {
    diagram.setState({downloadTriggerPopUp:false ,saveFilePopUp:false, uploadTriggerPopUp: true, trigger: true });
  }
  const onDownloadTriggerPopUp = () => {
    diagram.setState({uploadTriggerPopUp: false, saveFilePopUp:false, downloadTriggerPopUp: true, trigger: true});
  }
  

  
  const onLayout = () => {
    diagram.arrangeDiagram(diagram.state.diagram);

  }
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar
          style={{
            marginLeft: "-12px",
            marginRight: "-12px",
            backgroundColor: "#808080",
            height:"5px"
          }}
        >
          <div>
            <Button onClick={onUploadTriggerPopUp} color="inherit">
              <FontAwesomeIcon icon="upload" />
            </Button>
          </div>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-helper-label">
              LinkType
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={link}
              onChange={onSelectedLinkTypeChanged}
            >
              <MenuItem value="3">
                <em>None</em>
              </MenuItem>
              <MenuItem value={2}>Cascading</MenuItem>
              <MenuItem value={0}>Bezir</MenuItem>
              <MenuItem value={3}>Spline</MenuItem>
              <MenuItem value={1}>Polyline</MenuItem>
            </Select>
            <FormHelperText>Please choose your link type</FormHelperText>
          </FormControl>
          <Button onClick={onZoomInClicked} color="inherit">
            <FontAwesomeIcon icon="search-plus" />
          </Button>
          <Button onClick={onZoomOutClicked} color="inherit">
            <FontAwesomeIcon icon="search-minus" />
          </Button>
          <Button onClick={onLockClicked} color="inherit">
            <FontAwesomeIcon icon="unlock" />
          </Button>
          <Button onClick={onUndo} color="inherit">
            <FontAwesomeIcon icon="arrow-left" />
          </Button>
          <Button onClick={onRedo} color="inherit">
            <FontAwesomeIcon icon="arrow-right" />
          </Button>
          <Button onClick={onLayout} color="inherit">
            <FontAwesomeIcon icon="arrows-alt" />
          </Button>
          <Button  color="inherit">
            <FontAwesomeIcon onClick={onDownloadTriggerPopUp} icon="download"/>
          </Button>
          <Button  color="inherit">
            <FontAwesomeIcon onClick={onSaveModel} icon="save"/>
          </Button>
        </Toolbar>
      </AppBar>
     
    </div>
  );
}
