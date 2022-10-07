import { useSelector } from "react-redux";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { editCardModalTitle } from "../actions/EditCardModalTitle";

const CardModalTitle = () => {
  const [isShow, setIsShow] = React.useState(true);
  
  const currentCard = useSelector(
    (state) => state.rootReducer.currentCard || null
  );
  const currentUser = useSelector(
    (state) => state.rootReducer.user.currentUser.username
  );
  console.log(currentUser);
  console.log("cardModalTitle", currentCard);
  const dispatch = useDispatch();
  const { reset, register, handleSubmit } = useForm();

  const handleClick = () => {
    setIsShow(!isShow);
  };

  const onSubmit = (data) => {
    dispatch(editCardModalTitle(data, currentUser));
    reset();
    setIsShow(!isShow);
  };

  return (
    <>
      <div>
        {isShow ? (
          <button id="activityShow" onClick={handleClick}>
            {currentCard.cardTitle}
          </button>
        ) : (
          <div>
            <div className="mb-3">
              <form onSubmit={handleSubmit(onSubmit)}>
                <textarea
                  className="form-control"
                  rows="1"
                  {...register("cardTitle")}
                  defaultValue={currentCard.cardTitle}
                ></textarea>
                <button type="submit" className="btn btn-primary">
                  Update Title
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CardModalTitle;
