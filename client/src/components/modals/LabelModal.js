import React from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import PropTypes from "prop-types";

const LabelModal = (props) => {
  const boardLabels = useSelector(state => state.rootReducer.currentBoard.labels);

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onClose}
      preventScroll={true}
      style={{
        "overlay": {
          "backgroundColor": "none",
        },
        "content": {
          "height": "fit-content",
          "width": "fit-content",
          "padding": "0",
          "backgroundColor": "none",
        },
      }}
    >
      <div className="card">
        <h6 className="card-header">Labels</h6>
        <div className="list-group list-group-flush">
          {boardLabels.map((label, index) => {
            let labelName = "\u2800";
            if (label.name) labelName = label.name;
            return (
                <label className="list-group-item" style={{"cursor": "pointer", "width": "100%", "backgroundColor": label.color}}>
                  <input className="form-check-input" type="checkbox"/>
                  {labelName}
                </label>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}

export default LabelModal;

LabelModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
}
