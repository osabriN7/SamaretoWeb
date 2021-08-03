import React, { useState, useEffect } from 'react';
import '../../styles/DiagramStyle/radioButton.css';
import { useDispatch, useSelector } from 'react-redux';
import { uploadModel } from '../../actions/user.actions'
import mf from "diagram-library";

function UploadForm({ diagram }) {
    const [file, setFile] = useState();
    const dispatch = useDispatch();
    const userData = useSelector(state => state.userReducer);
    const filechosen = (e) => {
        setFile(e.target.files[0]);
        const fileSpan = document.getElementById('file-chosen');
        fileSpan.textContent = e.target.files[0].name;
    }
    
    const handleUploadFile = async (e) => {
        e.preventDefault();
        const nameModelError = document.querySelector(".nameModel.error");
        const checkedButtonError = document.querySelector('.radio.error')
        const modelBox = document.querySelector(".model");
        const matrixBox = document.querySelector(".matrix");
        checkedButtonError.innerHTML = "";
        if (nameModelError !== null) {
            nameModelError.innerHTML = "";
        }
        if (!modelBox.checked && !matrixBox.checked) {
            checkedButtonError.innerHTML = "Please choose your file type";
            return;
        }

        if (!file) {
            checkedButtonError.innerHTML = "Please select a file"
            return;
        }
        const modelsName = userData.modelsName.map((f) => f.split(".")[0]);



        if (modelBox.checked) {
            diagram.onChangeModel(file);
            diagram.setState({ trigger: false })
        }else if (matrixBox.checked) {
            diagram.onChangeMatrix(file);
            diagram.setState({ trigger: false })
        }


    }

    return (
        <div>
            <body>
                <h3 className="margin-b"> Upload file</h3>
                <label class="container">Matrix
                    <input className="matrix" id="matrix" type="radio" name="radio" />
                    <span class="checkmark"></span>
                </label>
                <label class="container">Model
                    <input className="model" id="model"  type="radio" name="radio" />
                    <span class="checkmark"></span>
                </label>
            </body>

            <form action="" onSubmit={handleUploadFile}>
                <label className="upload-label" for="file-upload">Choose File</label>
                <span id="file-chosen">No file chosen</span>
                <input
                    className="margin-t-b"
                    type="file"
                    id="file-upload"
                    name="file"
                    accept=".json"
                    onChange={filechosen}
                    hidden
                />
                <br />
                <div class="submit-container">
                    <input id="submit-bnt" className="btn btn-next " type="submit" value="Submit" />
                </div>
                <div className="radio error"></div>
            </form>

        </div>
    )
}

export default UploadForm
