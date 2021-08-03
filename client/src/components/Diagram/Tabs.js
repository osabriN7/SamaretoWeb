import { useState} from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import { DiagramView, NodeListView } from "diagram-library-react";
import Matrix from "./Matrix";
import "../../styles/DiagramStyle/Tabs.css";

function Tabs({diagram }) {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div className="">
      <div className="bloc-tabs">
        <button
          style={{ width: "200px" }}
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          Diagram
        </button>
        <button
          style={{ width: "200px" }}
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          MatrixView
        </button>
      </div>

      <div className="container-fluid content-tabs">
        <div
          className={toggleState === 1 ? "content active-content" : "content"}
        >
          <div class="wrapper">
            <div class="palette">
              <div>
                <label
                  class="text-center p-1 mb-2"
                  style={{
                    width: "100%"
                  }}
                  for="Nodes"
                >
                  <FontAwesomeIcon icon="caret-down" /> Nodes
                </label>
              </div>
              <div
                class="border border-dark marging-left-5"
                style={{ width: "190px" }}
              >
                <NodeListView
                  style={{ height: "80px", width: "185px" }}
                  nodes={diagram.state.nodes}
                  captions={diagram.state.captions}
                ></NodeListView>
              </div>
              <div>
                <label
                  class="text-center p-1 mb-2"
                  style={{
                    width: "100%"
                    //backgroundColor: "#87CEEB"
                  }}
                  for="Nodes"
                >
                  <FontAwesomeIcon icon="caret-down" /> ArrowShapes
                </label>
              </div>
              <div
                style={{ width: "190px" }}
                class="border border-dark marging-left-5"
              >
                <NodeListView
                  onNodeSelected={(sender, args) =>
                    diagram.onSelectedLinkChanged(sender, args)
                  }
                  style={{ height: "80px", width: "185px" }}
                  nodes={diagram.state.arrowHeadShapes}
                  captions={diagram.state.arrowHeadNames}
                ></NodeListView>
              </div>
              <label
                class="text-center p-1 mb-2"
                style={{
                  width: "100%"
                  //  backgroundColor: "#87CEEB"
                }}
                for="Nodes"
              >
                <FontAwesomeIcon icon="caret-down" /> AddPort
              </label>
              <div
                class="border border-dark marging-left-5"
                style={{ width: "190px" }}
              >
                <NodeListView
                  onNodeSelected={(sender, args) =>
                    diagram.onSelectedPortAdded(sender, args)
                  }
                  style={{ height: "80px", width: "185px" }}
                  nodes={diagram.state.arrowInOuts}
                  captions={diagram.state.arrowInOutName}
                ></NodeListView>
              </div>
            </div>
            <div id="diagram" class="diagram">
              <DiagramView
                diagram={diagram.state.diagram}
                {...diagram.state.props}
                style={{ height: "600px " }}
              />
            </div>
          </div>
        </div>

        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
          <Matrix matrix={diagram.state.matrix} />
        </div>
      </div>
    </div>
  );
}

export default Tabs;
