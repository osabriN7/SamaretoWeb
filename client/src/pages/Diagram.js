import React, { Component } from "react";
import mf from "diagram-library";
import cm from "mindfusion-common";
import "bootstrap/dist/css/bootstrap.min.css";
import Tree from "../components/Diagram/Tree";
import Tabs from "../components/Diagram/Tabs";
import ToolBar from "../components/Diagram/ToolBar";
import "../fontawsome-components/FontawsomeIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import "./styles.css";
import "../styles/DiagramStyle/Tabs.css";
import { io } from 'socket.io-client'
import PopUp from "../components/Diagram/PopUp";

import UploadForm from "../components/Forms/UploadForm";
import DownloadForm from "../components/Forms/DownloadForm";
import SaveForm from "../components/Forms/SaveForm"
import { withRouter } from "react-router-dom";

class Diagram extends Component {
  constructor(props) {
    super(props);

    var diagram = new mf.Diagramming.Diagram();
    diagram.setShowGrid(true);
    diagram.setDefaultShape("Container");
    diagram.setLinkShape(mf.Diagramming.LinkShape.Spline);

    diagram.setTheme(mf.Diagramming.Theme.getBusiness());

    var props = {
      id: "diagram1",
      backBrush: "#0a0a0a",
      behavior: mf.Diagramming.Behavior.LinkContainers
    };

    var AeroEffect = mf.Diagramming.AeroEffect;
    var GlassEffect = mf.Diagramming.GlassEffect;
    var GlassEffectType = mf.Diagramming.GlassEffectType;

    var glassEffect = new GlassEffect();
    glassEffect.setType(GlassEffectType.Type2);

    diagram.getNodeEffects().push(glassEffect);
    diagram.getNodeEffects().push(new AeroEffect());
    var firstNode = diagram.getNodes()[0];
    var nodes = [];
    nodes.push(firstNode);

    var counter = 1;

    var shapeNodes = [];
    var arrowInOuts = [];

    var shapeIds = ["Actor", "Plaque", "Database", "File"];
    var shapeName = ["Function", "Actor", "Plaque", "Database", "File"];
    var arrowHeadIds = ["Quill", "PointerArrow", "Pentagon"];
    var arrowHeadNames = ["Informations", "Energie", "Material"];
    var arrowInOutIds = ["Arrow3", "Arrow3", "Arrow5"];
    var arrowInOutName = ["InPut", "OutPut", "InPut/OutPut"];
    var arrowHeadNodes = [];

    //add container
    var node = new mf.Diagramming.ContainerNode();
    shapeNodes.push(node);

    for (var i = 0; i < shapeIds.length; i++) {
      node = new mf.Diagramming.ShapeNode(diagram);
      node.setShape(shapeIds[i]);
      shapeNodes.push(node);
    }

    for (var arrowHeadId of arrowHeadIds) {
      var arrowHead = new mf.Diagramming.ShapeNode(diagram);
      arrowHead.setShape(arrowHeadId);
      arrowHeadNodes.push(arrowHead);
    }

    var arrowInOut1 = new mf.Diagramming.ShapeNode(diagram);
    arrowInOut1.setId("inPut");
    arrowInOut1.setShape("Arrow3");
    arrowInOuts.push(arrowInOut1);

    var arrowInOut2 = new mf.Diagramming.ShapeNode(diagram);
    arrowInOut2.setId("outPut");
    arrowInOut2.setShape("Arrow3");
    arrowInOuts.push(arrowInOut2);

    var arrowInOut3 = new mf.Diagramming.ShapeNode(diagram);
    arrowInOut3.setId("all");
    arrowInOut3.setShape("Arrow5");
    arrowInOuts.push(arrowInOut3);

    //enable setting text field
    diagram.setAllowInplaceEdit(true);

    diagram.setUndoEnabled(true);

    diagram.addEventListener("nodeCreated", this.onAddContainer.bind(this));

    diagram.addEventListener(
      "containerChildAdded",
      this.onContainerChildAdded.bind(this)
    );
    diagram.addEventListener("linkCreated", this.onLinkCreated.bind(this))
    diagram.addEventListener(
      "nodeTextEdited",
      this.onNodeTextEdited.bind(this)
    );
    diagram.addEventListener("containerChildRemoved", this.onContainerChildAdded.bind(this));
    diagram.addEventListener("nodeDeleted", this.onNodeDeleted.bind(this));


    //socket.io
    const diagramId = this.props.match.params.id;

    const socket = io("http://localhost:3001");
    socket.on('connect', () => {
      console.log(`You connected with id : ${socket.id}`)
    })
    this.state = {
      changedByUser: false,
      diagramId: diagramId,
      jsonModel: [],
      trigger: false,
      uploadTriggerPopUp: false,
      downloadTriggerPopUp: false,
      saveFilePopUp: false,
      fileupload: null,
      props: props,
      matrix: [],
      matrixTrack: [],
      diagram: diagram,
      nextId: 1,
      containers: [],
      treeData: [],
      nodes: shapeNodes,
      captions: shapeName,
      socket: socket,
      arrowInOuts: arrowInOuts,
      arrowInOutName: arrowInOutName,
      arrowHeadShapes: arrowHeadNodes,
      arrowHeadIds: arrowHeadIds,
      arrowHeadNames: arrowHeadNames,
      behavior: mf.Diagramming.Behavior.LinkContainers
    };
  }



  onAddContainer(e, args) {
    var node = args.getNode();
    node.setId(this.state.nextId.toString());
    // var matrix = this.state.matrix;
    var arr = [];
    //var nbligne = matrix.length;
    /* arr[0] = (
      <button
        style={{ width: "20px", height: "20px" }}
        type="button"
        id={node.getId()}
      >
      </button>
    );
    if (matrix[0]) {
      for (var j = 1; j < matrix[0].length; j++) {
        arr[j] = (
          <button
            style={{ width: "20px", height: "20px" }}
            id={nbligne + "," + j}
            type="button"
            onClick={this.fct}
          ></button>
        );
      }
    }
    matrix.push(arr); */
    this.setState({ treeData: this.getDiagramJson(), changedByUser: true, matrix: this.getMatrix(), nextId: this.state.nextId + 1 });
  }

  getMatrix = () => {
    var matrix = this.state.matrix;
    var items = this.state.diagram.items;
    var allItems = this.state.diagram.items;
    var fcts = [];
    //rectifier
    for (var i = 0; i < allItems.length; i++) {
      fcts.push(this.getFctJson(allItems[i]));
    }
    items = this.filterJson(fcts);
    var myMatrix = [];
    if (matrix[0] && matrix[0][0] && matrix[0][0][0] && matrix[0][0][0].props && matrix[0][0][0].props.icon === "project-diagram") {
      for (var i = 0; i < items.length; i++) {
        var arr = []
        for (var j = 0; j < matrix[0].length; j++) {
          if (j === 0) {
            arr[j] = <button
              style={{ width: "20px", height: "20px" }}
              id={items[i].id}
              type="button"
            >{items[i].name}</button>
          } else {
            arr[j] = <button
              style={{ width: "20px", height: "20px" }}
              id={i + 1 + "," + j}
              type="button"
              onClick={this.fct}
            ></button>
          }
        }
        myMatrix.push(arr);
      }
      myMatrix.unshift(matrix[0]);
      for (var k = 1; k < myMatrix.length; k++) {
        var a = matrix.find((l) =>
          l[0].props && l[0].props.id === (myMatrix[k][0].props.id)
        )
        for (var l = 1; l < myMatrix[k].length; l++) {
          if (a && (a[l].props.children && a[l].props.children.props && a[l].props.children.props.icon === "expand-alt")) {
            myMatrix[k][l] = <button
              style={{ width: "20px", height: "20px" }}
              id={k + "," + l}
              type="button"
              onClick={this.fct}
            ><FontAwesomeIcon icon="expand-alt" /></button>
          }
        }
      }

      return myMatrix;
    }

    for (var i = 0; i < items.length; i++) {
      var arr = [];
      arr[0] = <button
        style={{ width: "20px", height: "20px" }}
        id={items[i].id}
        type="button"
      >{items[i].name}</button>
      myMatrix.push(arr);
    }
    return myMatrix;
  }

  onChangeModel = (file) => {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const file = e.target.result;
      const data = JSON.parse(file);
      const functions = data.functions;
      var alreadyDrawnChild = [];
      var containers = [];


      this.drawTree(functions, null);

      containers = this.state.containers;


      //draw links
      for (var i = 0; i < data.links.length; i++) {
        var idOrigin = data.links[i].origin.fct;
        var idTarget = data.links[i].target.fct;

        // create a link
        var origin = containers.find((c) => c.name === idOrigin);
        var target = containers.find((c) => c.name === idTarget);
        /*var link = new mf.Diagramming.DiagramLink(
          diagram.state.diagram,
          origin.container,
          target.container
        );*/
        var link = this.state.diagram.getFactory().createDiagramLink(origin.container, target.container);
        link.setShape(mf.Diagramming.LinkShape.Cascading);
        link.setHeadBrush("blue");
        link.setHeadShape("Triangle");
        link.setHeadShapeSize(3);
        link.route();

        var originPorts = origin.container.getAnchorPattern().getPoints();
        var originPort = originPorts.find((p) => {
          return p.getToolTip() === data.links[i].origin.port
        })
        link.setOriginAnchor(originPort.getTag())

        var targetPorts = target.container.getAnchorPattern().getPoints();
        var targetPort = targetPorts.find((p) => {
          return p.getToolTip() === data.links[i].target.port
        })
        link.setDestinationAnchor(targetPort.getTag())


        // var linkStyle = new mf.Diagramming.Style();
        // linkStyle.setBrush({type:'SolidBrush', color:'rgb(255, 0, 5)'});
        // linkStyle.setStroke("#959595");
        // diagram.state.diagram.getTheme().styles['std:DiagramLink'] = linkStyle;

        //diagram.state.diagram.addItem(link);
      }

      //Styling

      this.state.diagram.resizeToFitItems();
      this.setState({ treeData: this.getDiagramJson() });

      //style links

      // var linkStyle = new mf.Diagramming.Style();
      // linkStyle.setBrush({type:'SolidBrush', color: 'rgb(255, 0, 5)'});
      // linkStyle.setStroke('#959595');
      // diagram.state.diagram.getTheme().styles['std:DiagramLink'] = linkStyle;
      var functionsName = this.getAllFunNames(functions);
      
      var matrix = functionsName.map((n) => [<button
        style={{ width: "20px", height: "20px" }}
        id={n}
        type="button"
      >{n}</button>]);

      this.setState({ matrix: matrix, jsonModel: this.state.diagram.toJson() });
    };
  };

  matrixToJson = (matrix) => {
    var json = []
    var obj = {};
    var start = 0;
    var arr = []
    if (matrix[0] && matrix[0][0] && matrix[0][0][0] && matrix[0][0][0].props && matrix[0][0][0].props.icon === "project-diagram") {
      obj = { name: "project-diagram", type: "image", clickable: false, id: "" }
      arr.push(obj)
      for (var j = 1; j < matrix[0].length; j++) {
        obj = { name: matrix[0][j], type: "text", clickable: false, id: "" }
        arr.push(obj);
      }
    }

    if (arr.length > 0) {
      json.push(arr)
      start = 1
    }
    for (var i = start; i < matrix.length; i++) {
      arr = []
      for (var j = 0; j < matrix[i].length; j++) {
        if (j === 0) {
          console.log( matrix[i][j])
          obj = {
            name: matrix[i][j].props.children,
            type: "button",
            clickable: false,
            id: matrix[i][0].props.id
          }
        } else {
          obj = {
            name: "fleche",
            type: "button",
            clickable: true,
            id: matrix[i][j].props.id
          }
        }
        arr.push(obj);
      }
      json.push(arr);
    }
    return json
  }
  getAllChildren = (children) => {
    if (children.length === 0) {
      return [];
    }

    var obj2 = [
      {
        id: children[0].id,
        name: children[0].text.text,
        children: children[0].children.map((child) =>
          this.getAllChildren(child)
        )
      }
    ];
    return obj2;
  };
  findRec = (treeData, id) => {
    if (treeData.length > 0 && treeData[0].id === id) {
      return treeData[0];
    } else if (treeData.length > 0) {
      var node = this.findRec(treeData[0].children, id);
      if (node) {
        return node;
      } else {
        return this.findRec(treeData.slice(1), id);
      }
    }
  };

  filterRec = (treeData, id) => {
    var filtredTree1 = treeData.filter((node) => node.id != id);
    return filtredTree1.map((node) => {
      var obj = {
        id: node.id,
        name: node.name,
        children: this.filterRec(node.children, id)
      };
      return obj;
    });
  };
  onContainerChildAdded(e, args) {

    this.setState({ changedByUser: true, treeData: this.getDiagramJson() });
  }

  onLinkCreated(e, args) {
    this.setState({ changedByUser: true })
    this.state.socket.emit('send-diagram-json', this.state.diagram.toJson())
  }

  onNodeDeleted(e, args) {
    var nodesNames = this.state.diagram.items.map((node) => node.getText() === "" ? node.getId() : node.getText());
    var listChilds = args.getNode().getChildren();
    //var matrix = this.state.matrix;
    /* matrix = matrix.filter((l) => {
     if(Array.isArray(l[0]) &&  l[0][0].props.icon ==="project-diagram"){ 
       return true;
     }
     if(l[0].props) {
       return nodesNames.includes(l[0].props.children) || nodesNames.includes(l[0].props.children[0])
     }
     return nodesNames.includes(l[0]);
   })
   console.log(matrix)
   for(var i = 1; i < matrix.length; i ++) {
     for(var j = 1; j < matrix[i].length; j ++) {
       if (matrix[i][j].props.children &&  matrix[i][j].props.children.props && matrix[i][j].props.children.props.icon ==="expand-alt"){
         matrix[i][j] = <button
         style={{ width: "20px", height: "20px" }}
         id={i + "," +  j}
         type="button"
         onClick={this.fct}
       ><FontAwesomeIcon icon="expand-alt" /></button>;
       } else{
         matrix[i][j] = <button
         style={{ width: "20px", height: "20px" }}
         id={i + "," +  j}
         type="button"
         onClick={this.fct}
       ></button>;
       }
     }
   }  */

    listChilds.forEach((node) => this.state.diagram.removeItem(node));
    this.setState({ changedByUser: true, matrix: this.getMatrix(), treeData: this.getDiagramJson() });
  }
  getAllChilds(node) {
    if (node.length === 0) {
      return [];
    }
    return node[0].getChildren().concat(this.getAllChilds(node[0].getChildren()));
  }
  onNodeTextEdited(e, args) {
    var node = args.getNode();
    var id = node.getId();
    /* var matrix = this.state.matrix;
    for (var i = 0; i < matrix.length; i++) {
      if (matrix[i][0].props && matrix[i][0].props.id === id) {
        matrix[i][0] =
        <button
          style={{ width: "40px", height: "20px" }}
          id={id}
          type="button"
        >{node.getText()}</button>;
      }
    } */
    this.setState({ treeData: this.getDiagramJson(), changedByUser: true, matrix: this.getMatrix() });

  }

  onSelectedLinkChanged(sender, args) {
    this.setState({ changedByUser: true })
    var selectedShape = args.getNode().getShape();
    this.state.diagram.setLinkHeadShape(selectedShape);
  }

  arrangeDiagram(diagram) {
    var layout = new mf.Graphs.TreeLayout();
    layout.direction = 1; //LayoutDirection.LeftToRight
    layout.nodeDistance = 30;
    layout.anchoring = mf.Graphs.Anchoring.Keep;
    diagram.arrange(layout);
    //	diagram.zoomToFit();
    diagram.routeAllLinks();
    this.state.diagram.resizeToFitItems();
  }

  onSelectChange(event) {
    this.setState({ behavior: +event.target.value });
  }

  onSelectedLinkTypeChanged(event) {
    this.state.diagram.setLinkShape(event.target.val);

    if (event.target.value === 2) this.state.diagram.setRouteLinks(true);
    else this.state.diagram.setRouteLinks(false);
  }
  exist = (x, y, points) => {
    if (points.length === 0) return false;
    if (x === points[0].x && y === points[0].y) return true;
    return this.exist(x, y, points.slice(1));
  };
  goodForma = (x, y) => {
    return (
      (x !== 0 && y === 0 && x < 100) ||
      (x === 0 && y !== 0 && y < 100) ||
      (x !== 0 && y === 100 && x < 100) ||
      (x === 100 && y !== 0 && y < 100)
    );
  };
  onSelectedPortAdded(sender, args) {
    this.setState({ changedByUser: true })
    var selectedItems = this.state.diagram.getSelection().nodes;

    if (selectedItems && selectedItems.length > 0) {
      var selectedNode = selectedItems[0];
      const set = [0, 10, 20, 30, 40, 50, 60, 70, 80, 100];
      var x = 10;
      var y = 0;
      var pattern = selectedNode.getAnchorPattern();
      while (
        !this.goodForma(x, y) ||
        (pattern && this.exist(x, y, pattern.points))
      ) {
        x = set[Math.floor(Math.random() * set.length)];
        y = set[Math.floor(Math.random() * set.length)];
      }
      var p = new mf.Diagramming.AnchorPoint(x, y, false, false);
      p.setMarkStyle(mf.Diagramming.MarkStyle.Rectangle);
      p.setSize(5);
      if (args.getNode().getId() == "inPut") {
        p.setColor("rgb(50,205,50)");
        p.setAllowIncoming(true);
      } else if (args.getNode().getId() == "outPut") {
        p.setColor("rgb(220,20,60)");
        p.setAllowOutgoing(true);
      } else {
        p.setAllowIncoming(true);
        p.setAllowOutgoing(true);
      }
      if (pattern) {
        var points = pattern.getPoints();
        points.push(p);
        pattern.setPoints(points);

        selectedNode.setAnchorPattern(pattern);
      } else {
        pattern = new mf.Diagramming.AnchorPattern([p]);
        selectedNode.setAnchorPattern(pattern);
      }
    }
    this.state.socket.emit('send-diagram-json', this.state.diagram.toJson())
  }

  addTocontainer = (fct, container) => {
    container.add(fct);
    container.resizeToFitChildren(true, 2);
    container.arrange(new mf.Graphs.LayeredLayout());
  };

  drawFct = (fct, diagram) => {
    var container = diagram
      .getFactory()
      .createContainerNode(new cm.Drawing.Rect(10, 20, 50, 25));
    container.setText(fct.name);
    container.setId(this.state.nextId);
    var ports = fct.ports;
    var listPorts = [];
    for (var i = 0; i < ports.length; i++) {
      var p = null;
      if (ports[i].type == "in") {
        if (i < 9) {
          p = new mf.Diagramming.AnchorPoint(10 * (i + 1), 0, true, false);
          p.setColor("rgb(50,205,50)");
        } else if (i < 18) {
          p = new mf.Diagramming.AnchorPoint(0, 10 * (i - 8), true, false);
          p.setColor("rgb(50,205,50)");
        } else if (i < 27) {
          p = new mf.Diagramming.AnchorPoint(10 * (i - 17), 100, true, false);
          p.setColor("rgb(50,205,50)");
        } else if (i < 38) {
          p = new mf.Diagramming.AnchorPoint(100, i - 26, true, false);
          p.setColor("rgb(50,205,50)");
        }
      } else if (ports[i].type == "out") {
        if (i < 9) {
          p = new mf.Diagramming.AnchorPoint(10 * (i + 1), 0, false, true);
          p.setColor("rgb(220,20,60)");
        } else if (i < 18) {
          p = new mf.Diagramming.AnchorPoint(10 * (i - 8), 0, false, true);
          p.setColor("rgb(220,20,60)");
        } else if (i < 27) {
          p = new mf.Diagramming.AnchorPoint(10 * (i - 17), 100, false, true);
          p.setColor("rgb(220,20,60)");
        } else if (i < 38) {
          p = new mf.Diagramming.AnchorPoint(100, i - 26, false, true);
          p.setColor("rgb(220,20,60)");
        }
      } else {
        if (i < 9) {
          p = new mf.Diagramming.AnchorPoint(10 * (i + 1), 0, true, true);
          p.setColor("rgb(30,144,255)");
        } else if (i < 18) {
          p = new mf.Diagramming.AnchorPoint(10 * (i - 8), 0, true, true);
          p.setColor("rgb(30,144,255)");
        } else if (i < 27) {
          p = new mf.Diagramming.AnchorPoint(10 * (i - 17), 100, true, true);
          p.setColor("rgb(30,144,255)");
        } else if (i < 38) {
          p = new mf.Diagramming.AnchorPoint(100, i - 26, true, true);
          p.setColor("rgb(30,144,255)");
        }
      }

      p.setMarkStyle(mf.Diagramming.MarkStyle.Rectangle);
      p.setTag(i);
      p.setToolTip(ports[i].name);
      listPorts.push(p);
    }
    var pattern = new mf.Diagramming.AnchorPattern(listPorts);
    container.setAnchorPattern(pattern);

    var obj = {
      name: fct.name,
      id: this.state.nextId,
      container: container
    };
    this.state.containers.push(obj);
    this.setState({ nextId: this.state.nextId + 1 });
    if (fct.children) this.drawTree(fct.children, container);

    return obj;
  };

  drawTree = (functions, container) => {
    if (container) {
      return functions.map((fct) =>
        this.addTocontainer(
          this.drawFct(fct, this.state.diagram).container,
          container
        )
      );
    }
    functions.map((fct) => this.drawFct(fct, this.state.diagram));
  };

  onZoomOutClicked(e) {
    var zoom = this.state.diagram.getZoomFactor();
    zoom -= 10;
    if (zoom > 10) this.state.diagram.setZoomFactor(zoom);
  }

  onZoomInClicked(e) {
    var zoom = this.state.diagram.getZoomFactor();

    zoom += 10;
    if (zoom < 500) this.state.diagram.setZoomFactor(zoom);
  }
  fct = (event) => {
    var ij = event.currentTarget.id;
    var arr_i_j = ij.split(",");
    var matrix = this.state.matrix;
    if (arr_i_j[0] === "v") {
      matrix[arr_i_j[1]][arr_i_j[2]] = <button
        style={{ width: "20px", height: "20px" }}
        id={arr_i_j[1] + "," + arr_i_j[2]}
        type="button"
        onClick={this.fct}
      ></button>
    } else {
      matrix[arr_i_j[0]][arr_i_j[1]] = <button
        style={{ width: "20px", height: "20px" }}
        id={"v," + ij}
        type="button"
        onClick={this.fct}
      ><FontAwesomeIcon icon="expand-alt" /></button>
    }
    this.setState({ changedByUser: true, matrix: matrix });
  };
  getMaxId() {
    var allItems = this.state.diagram.items;
    var fcts = [];
    for (var i = 0; i < allItems.length; i++) {
      fcts.push(this.getFctJson(allItems[i]));
    }
    var max = 0;
    this.filterJson(fcts).forEach((i) => {
        max += 1;
      })
    return max;
  }
  findInChild = (arr, id) => {
    if (arr.length === 0) {
      return false;
    }
    if (this.findRec(arr[0].children, id)) return true;
    return this.findInChild(arr.slice(1), id);
  };
  filterJson = (fcts) => {
    var fctsFiltred = fcts;
    for (var i = 0; i < fcts.length; i++) {
      if (this.findInChild(fctsFiltred, fcts[i].id)) {
        fctsFiltred = fctsFiltred.filter((f) => f.id !== fcts[i].id);
      }
    }
    fctsFiltred = fctsFiltred.filter((f) => f.id);
    return fctsFiltred;
  };

  getAllFunNames = (data) => {
    var globalFunNames = data.map((f) => f.name);
    var localFunNames = data.map((f) => this.getAllFunNames(f.children));
    var localFunNamesFlat = localFunNames.flat();
    return localFunNamesFlat.concat(globalFunNames);
  };
  getDiagramJson = () => {
    var allItems = this.state.diagram.items;
    var fcts = [];
    for (var i = 0; i < allItems.length; i++) {
      fcts.push(this.getFctJson(allItems[i]));
    }

    return this.filterJson(fcts);
  };
  getFctJson = (fct) => {
    var obj = {};
    if (!fct.children || fct.children.length == 0) {
      obj = {
        id: fct.id,
        name: fct.text.text,
        children: []
      };
      return obj;
    }
    obj = {
      id: fct.id,
      name: fct.text.text,
      children: fct.children.map((f) => this.getFctJson(f))
    };
    return obj;
  };
  filechosen = (e) => {
    const fileSpan = document.getElementById('file-chosen');
    fileSpan.textContent = e.target.files[0].name;
  }



  onChangeMatrix = (file) => {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const file = e.target.result;
      const data = JSON.parse(file);
      data.unshift([<FontAwesomeIcon icon="project-diagram" />]);
      var matrix = this.state.matrix;
      matrix.unshift(data);

      for (var i = 1; i < matrix.length; i++) {
        var arr = [];
        for (var k = 0; k < data.length; k++) {
          if (k === 0) {
            arr[k] = matrix[i][0];
          } else {
            arr[k] = (
              <button
                style={{ width: "20px", height: "20px" }}
                id={i + "," + k}
                type="button"
                onClick={this.fct}
              ></button>
            );
          }
        }
        matrix[i] = arr;
      }
      this.setState({ changedByUser: true, matrix: matrix });
    };
  };


  componentDidMount() {
    this.state.socket.emit('get-diagram', this.state.diagramId)

    

     this.state.socket.on('receive-changes', (data) => {
      this.state.diagram.fromJson(data.json);
       var matrix = data.matrix;
       for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j].type === "image") {
            var arr = [<FontAwesomeIcon icon="project-diagram" />]
            matrix[i][j] = arr;
          } else if (matrix[i][j].type === "text") {
            matrix[i][j] = matrix[i][j].name
          } else if (matrix[i][j].type === "button" && matrix[i][j].clickable) {
            if (matrix[i][j].id.split(",")[0] === "v") {
              matrix[i][j] = <button
                style={{ width: "20px", height: "20px" }}
                id={matrix[i][j].id}
                type="button"
                onClick={this.fct}
              > <FontAwesomeIcon icon="expand-alt" /></button>
            } else {
              matrix[i][j] = <button
                style={{ width: "20px", height: "20px" }}
                id={matrix[i][j].id}
                type="button"
                onClick={this.fct}
              > </button>
            }

          } else {
            matrix[i][j] = <button
              style={{ width: "20px", height: "20px" }}
              id={matrix[i][j].id}
              type="button"
              onClick={this.fct}
            >{matrix[i][j].name} </button>
          }
        }
      }
      this.setState({ changedByUser: false, matrix: matrix, treeData: data.treeData,  });

     })
  }
  //useEffect equivalent
  componentDidUpdate(prevProps) {

       if (!this.state.changedByUser) return
       this.state.socket.emit('send-changes', {json: this.state.diagram.toJson(), treeData: this.state.treeData, matrix:  this.matrixToJson(this.state.matrix) });
  }



  render() {
    return (
      <div class="container-fluid">
        <div class="row">
          <ToolBar diagram={this} />
        </div>
        <div class="row  mt-1  " style={{ height: "500px" }}>
          <div class="col-md-2 bg-secondary border border-dark rounded ">
            <label
              class="text-center p-1 mb-2"
              style={{
                width: "100%"
              }}
              for="Nodes"
            >
              <FontAwesomeIcon icon="caret-down" /> TreeView
            </label>
            <div class="border border-dark rounded" style={{ overflow: "auto", height: "300px" }}>
              <Tree socket={this.state.socket} data={this.state.treeData} />
            </div>
          </div>

          <div  class=" col-md-10 bg-secondary rounded border border-dark  ">
            <Tabs
              diagram={this}
            />
            <PopUp trigger={this.state.trigger} diagram={this} >
              {this.state.uploadTriggerPopUp ? (
                <UploadForm diagram={this} />
              ) : (
                ""
              )}
              {this.state.downloadTriggerPopUp ? (
                <DownloadForm diagram={this} />
              ) : (
                ""
              )}
              {this.state.saveFilePopUp ? (
                <SaveForm diagram={this} />
              ) : (
                ""
              )}
            </PopUp>
          </div>
        </div>
      </div >
    );
  }
}

export default withRouter(Diagram);
