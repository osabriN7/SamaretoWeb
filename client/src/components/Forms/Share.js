import React from 'react'
import  ReactDOM  from 'react-dom'
import '../../styles/PagesStyle/Share.css'

const MODAL_STYLES = {
    position: 'fixed',
    top:'50%',
    left:'50%',
    transform: 'translate(-50%, -50%)',
    backgroudColor: '#FFFF',
    padding: '50px',
    zIndex : 1000
}

const OVERLAY_STYLE = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroudColor: 'rgba(0,0,0, 0.7)',
    zIndex : 1000
}
function Share({open, children, onClose}) {
    if(!open) return null
    return ReactDOM.createPortal (
        <>
        <div className="popup">
        <div style={MODAL_STYLES}>
            {children}
        </div>
        </div>
        </>,
        document.getElementById('portal')
    )
}

export default Share
