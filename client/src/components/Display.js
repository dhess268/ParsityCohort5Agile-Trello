import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom/dist";
import Board from "./Board";
import "../css/Display.css";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

const addModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
const removeModalStyles = {
  content: {
    top: "10%",
    left: "30%",
    right: "30%",
    bottom: "10%",
  },
}
const Display = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  // const [boards, setBoards] = useState([])
  const [removeModalIsOpen, setRemoveIsOpen] = useState(false)
  const user = useSelector((state) => state.rootReducer.user.currentUser);


  // const fetchBoardData = () => {
  //   const url = `/organization/${user.organization._id}/boards`;
  //   const token = localStorage.token;
  //   const config = {
  //     method: "get",
  //     url,
  //     headers: { Authorization: `Bearer ${token}` }
  //   };

  //   axios(config).then((data) => {
  //     setBoards(data)
  //   })
  // }


  // useEffect(() => {
  //   if(user){
  //     fetchBoardData()
  //   }
  // }, [])

  const navigate = useNavigate();
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    console.log("done!");
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openRemoveModal() {
    setRemoveIsOpen(true)
  }

  function afterOpenRemoveModal() {
    console.log('done!')
  }

  function closeRemoveModal() {
    setRemoveIsOpen(false)
  }

  const createBoard = (e) => {
    e.preventDefault();
    const url = `/boards/`;
    const token = localStorage.token;
    const config = {
      method: "post",
      url,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        boardName: title,
        organization: user.organization._id,
        users: user.organization.orgMembers,
      },
    };
    axios(config)
      .then((res) => {
        closeModal();
        navigate(`/b/${res.data._id}`);
      })
      .catch((err) => console.log("ERROR", err));
  };

  // refactor this and replace with user data above
  const boardsData = useSelector((state) => {
    if (state.rootReducer.user.currentUser) {
      return state.rootReducer.user.currentUser.organization.orgBoards;
    }
  });

  const removeBoard = (id) => {
    const url = `/boards/${id}`;
    const token = localStorage.token;
    const config = {
      method: "delete",
      url,
      headers: { Authorization: `Bearer ${token}` }
    };
    axios(config).then(() => {
      // refresh page
      navigate(0)
    })
    closeRemoveModal()
  }

  const renderBoardList = () => {
    if(user){
      const list = user.organization.orgBoards.map((board) => {
        return (
          <li key={board._id} className="list-item row mb-2">
            <span className="col-md-6">{board.boardName}</span>
            <button type="button" className="btn btn-danger col-md-4" onClick={() => removeBoard(board._id)}>Remove</button>
          </li>

        )
      })
      return list
    }
  }

  const renderBoards = () => {
    const boardsArray = boardsData.map((board, i) => {
      return <Board key={i} boardId={board._id}></Board>;
    });

    return boardsArray;
  };
  if (boardsData) {
    return (
      <section className="container">
        <section className="row row-cols-3 boards__section gy-5 justify-content-center">
          {renderBoards()}
          <button className="btn btn-primary" onClick={openModal}>
            Add New Board
          </button>
          <button className="btn btn-danger" onClick={openRemoveModal}>
            Remove a Board
          </button>
        </section>
        <Modal
          isOpen={removeModalIsOpen}
          onAfterOpen={afterOpenRemoveModal}
          onRequestClose={closeRemoveModal}
          contentLabel="Remove board modal"
          style={removeModalStyles}
        >
          <div className="scroll-component">
            <div className="scroll-content">
              <button onClick={closeModal}>Close</button>
              <h2>Remove a Board</h2>
              <ul>{renderBoardList()}</ul>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={addModalStyles}
          contentLabel="Example Modal"
        >
          <button onClick={closeModal}>Close</button>
          <h2>Create New Board</h2>
          <div>Board Name</div>
          <form onSubmit={(e) => createBoard(e)}>
            <input onChange={(e) => setTitle(e.target.value)} />
            <button type="submit">Create</button>
          </form>
        </Modal>
      </section>
    );
  } else {
    <div>LOADING</div>;
  }
};
Modal.setAppElement("#root");

export default Display;
