import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import PropTypes from "prop-types";
import Card from "./Card";
import { createList } from "../actions/CreateList";
import { deleteList } from "../actions/DeleteList";
import ListTitle from "./ListTitle";
import ListFooter from "./ListFooter";
import ClickDetectWrapper from "./ClickDetectWrapper";
// import { loadCard } from "../actions/LoadCard";

const List = (props) => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  // Modal stuff
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleClick = (e) => {
    setModalIsOpenToTrue();
    localStorage.setItem("card", e.target.value);
  };
  const setModalIsOpenToTrue = (e) => {
    setModalIsOpen(true);
  };
  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
  };

  const handleCancelClick = () => {
    dispatch({ type: "CANCEL_ADD_LIST" });
    console.log("cancelled!")
  }

  const handleDeleteClick = () => {
    dispatch(deleteList(props.listId));
  };

  const onNewListSubmit = (data) => {
    dispatch(createList(data.newListTitle, props.boardId))
  }

  let cards = props.cards;
  let name = props.name;

  // If the list rendering is a "temporary" list that will be added to the board
  if (!name) {
    return (
      <ClickDetectWrapper callback={handleCancelClick}>
        <div className="col-3">
          <div className="card bg-black">
            <form onSubmit={handleSubmit(onNewListSubmit)}>
              <div className="card-body">
                <input className="form-control" placeholder="Enter list title..." {...register("newListTitle")}/>
              </div>
              <div className="card-footer d-flex align-items-center gap-2">
                <button className="btn btn-secondary" type="submit">
                  Add List
                </button>
                <button className="btn-close btn-close-white" onClick={handleCancelClick} type="button" aria-label="Close" />
              </div>
            </form>
          </div>
        </div>
      </ClickDetectWrapper>
    )
  }

  // This is what renders for normal lists
  return (
    <div className="col-3">
      <div className="card bg-black">
        <div className="card-body" style={{"paddingBottom": "0"}}>
          <div className="card-title text-white row d-flex align-items-center">
            <div className="col-11"><ListTitle name={name} listId={props.listId} listCards={cards}/></div>
            <button className="btn-close btn-close-white col-1" onClick={handleDeleteClick} type="button" aria-label="Close" /> 
          </div>
          <ul className="list-group gap-2">
            {cards.map((card) => {
              if (!card._id) {
                return (
                  <form key="tempCard">
                    <input className="form-control" placeholder="Enter a title for this card..." />
                  </form>
                )
              }
              return (
                <div key={card._id}>
                  <button
                    value={card._id}
                    onClick={handleClick}
                    className="list-group-item list-group-item-action"
                  >
                    {card.cardTitle}
                  </button>
                  <Modal isOpen={modalIsOpen}>
                    <button onClick={setModalIsOpenToFalse}>x</button>
                    <Card />
                  </Modal>
                </div>
              );
            })}
          </ul>
        </div>
        <div className="card-footer d-grid">
          <ListFooter listId={props.listId}/>
        </div>
      </div>
    </div>
  );
};

List.propTypes = {
  cards: PropTypes.array,
  name: PropTypes.string.isRequired,
  boardId: PropTypes.string.isRequired,
  listId: PropTypes.string.isRequired,
};

export default List;
