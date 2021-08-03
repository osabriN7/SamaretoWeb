import axios from "axios"


export const GET_USER = "GET_USER";
export const UPLOAD_MODEL = "UPLOAD_MODEL"
export const DOWNLOAD_MODEL="DOWNLOAD_MODEL"

export const getUser = (uid) => {
    return (dispatch) => {
        return axios
            .get(`${process.env.REACT_APP_API_URL}api/user/${uid}`)
            .then((res) => {
                dispatch({ type: GET_USER, payload: res.data })
            })
            .catch((err) => console.log(err))
    };
};

export const uploadModel = (data, id) => {
    return (dispatch) => {
        return axios
            .post(`${process.env.REACT_APP_API_URL}api/user/upload`, data)
            .then((res) => {
                return axios
                    .get(`${process.env.REACT_APP_API_URL}api/user/${id}`)
                    .then((res) => {
                        dispatch({ type: UPLOAD_MODEL, payload: res.data.modelsName })
                    })
            })
            .catch(err => console.log(err))
    }
}


