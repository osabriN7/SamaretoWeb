import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import "../../styles/DiagramStyle/Tree.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Tree = ({ diagram, socket, data}) => {
  //const [treeData, setData] = useState([])
   /* useEffect(()=>{
     if(!socket) return 
    socket.on('receive-tree-data', (treeData) => {
      diagram.setState({changedByUser:false})
      diagram.setState({treeData:treeData})
    })  
  },[]) */
 /*  useEffect(()=>{
    setData(data);
  }, [data]) */
  return (
    <div className="d-tree">
      <ul className="d-flex d-tree-container flex-column">
        {data.map((tree) => (
          <TreeNode node={tree} />
        ))}
      </ul>
    </div>
  );
};

const TreeNode = ({ node }) => {
  const [childVisible, setChildVisiblity] = useState(false);

  const hasChild = node.children ? true : false;

  return (
    <li className="d-tree-node border-0">
      <div className="d-flex" onClick={(e) => setChildVisiblity((v) => !v)}>
        {hasChild && (
          <div
            className={`d-inline d-tree-toggler ${
              childVisible ? "active" : ""
            }`}
          >
            <FontAwesomeIcon icon="caret-right" />
          </div>
        )}

        <div className="col pl2 d-tree-head">
          <i className="">
            <FontAwesomeIcon icon="project-diagram" />{" "}
          </i>

          {node.name}
        </div>
      </div>

      {hasChild && childVisible && (
        <div className="d-tree-content">
          <ul className="d-flex d-tree-container flex-column">
            <Tree data={node.children} />
          </ul>
        </div>
      )}
    </li>
  );
};

export default Tree;
