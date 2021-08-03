import React from 'react'
import '../../styles/PagesStyle/PopUp.css'

function PopUp(props) {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <a   className="close" onClick={() => props.diagram.setState({trigger:false})}/>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default PopUp
