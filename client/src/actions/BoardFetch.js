import axios from "axios";

export const FETCH_BOARD = "FETCH_BOARD";
export const fetchBoard = (boardId, token) => (dispatch) => {
  const url = `/boards/${boardId}`;

  return axios
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then(function (response) {
      dispatch({
        type: FETCH_BOARD,
        payload: response.data,
      });
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
};
