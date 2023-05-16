import axios from "axios";
import { axiosAuth } from "../utils/axiosAuth";

export const DELETE_LIST = "DELETE_LIST";
export const deleteList = (listId) => (dispatch) => {
  const token = localStorage.token;
  axiosAuth({
    method: "delete",
    url: `/lists/${listId}`,
    headers: {'Authorization': `Bearer ${token}`},
  })
    .then(() => dispatch({ type: DELETE_LIST, payload: listId }))
}
