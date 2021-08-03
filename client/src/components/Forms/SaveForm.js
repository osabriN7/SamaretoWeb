import React, { useState, useEffect } from 'react';
import '../../styles/DiagramStyle/radioButton.css';
import { useDispatch, useSelector } from 'react-redux';
import { uploadModel } from '../../actions/user.actions'
import mf from "diagram-library";

function SaveForm({ diagram }) {
    const [modelName, setModelName] = useState("");
    const dispatch = useDispatch();
    const userData = useSelector(state => state.userReducer);
    const handleSaveFile =  (e) => {
        const nameModelError = document.querySelector(".nameModel.error");
        nameModelError.innerHTML = ""
        if (modelName === "") {
            nameModelError.innerHTML = "Please choose a model name"
            return;
        }

        const modelsName = userData.modelsName.map((f) => f.split(".")[0]);
        if (modelsName.includes(modelName)) {
            nameModelError.innerHTML = "Model name already choosen"
            return;
        }

        const data = {name: modelName, userId: userData._id, file: diagram.state.diagram.toJson()}
        dispatch(uploadModel(data, userData._id));
        diagram.setState({ trigger: false })
        

    }

    return (
        <div>
            <h3 className="margin-b"> Save Model</h3>
            <label htmlFor="file-name">Model Name</label>
            <input className="margin-l"
                type="file-name"
                name="file-name"
                id="file-name"
                onChange={(e) => setModelName(e.target.value)}
                value={modelName}
            />
            <div className="nameModel error"></div>
            <br />
            <div class="submit-container">
                <button id="submit-bnt" className="btn btn-next " onClick={handleSaveFile}  >Submit</button>
            </div>

        </div>
    )
}

export default SaveForm
