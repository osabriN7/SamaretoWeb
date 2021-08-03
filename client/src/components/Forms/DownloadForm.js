import React from 'react'
import '../../styles/DiagramStyle/button.css'
import { useSelector } from 'react-redux'
import axios from 'axios';


export default function DownloadForm ({diagram})  {

    const userData = useSelector((state) => state.userReducer);
    const handleImport = (m) => {
        var modelName = userData.modelsName.find((u) => u.includes(m));
        modelName = modelName.split('.')[0] + '-' + userData._id + ".json" ;
        console.log(modelName)
        axios({
            method:"post",
            url :`${process.env.REACT_APP_API_URL}api/user/download`,
            withCredentials: true,
            data : {
                modelName,
            }
        })
        .then((res) => {
            diagram.state.diagram.fromJson(JSON.stringify(res.data));
            diagram.setState({ treeData: diagram.getDiagramJson(), matrix: diagram.getMatrix(), trigger:false, nextId: diagram.getMaxId()});
        })
        .catch((err) => {
            console.log(err)
        })

    }
    return (
        <div>
            <h3>Please select your model</h3>
            {
                 
                     userData.modelsName.map((m) => <button onClick={() => handleImport(m)} className="the-button my-button">{m}</button>)
                     

            }
        </div>
    )
}
