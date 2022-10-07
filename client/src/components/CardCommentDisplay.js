import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "../actions/DeleteComment";

const CommentsDiplay = () => {
  const currentCard =
    useSelector((state) => state.rootReducer.currentCard._id) || null;
  const dispatch = useDispatch();
  const currentComments = useSelector(
    (state) => state.rootReducer.currentCard.cardComments
  );
  // console.log("cardCommentDisplay", currentComments);
  useEffect(() => {
    //load the card that is clicked
    renderComments();
  }, []);
  const handleClick = (e) => {
    console.log("commentId", e.target.id);
    dispatch(deleteComment(e.target.id, currentCard));
    // renderComments();
  };
  const renderComments = () => {
    if (currentComments) {
      const displayedComments = currentComments.map((comment) => {
        return (
          <tbody key={comment._id}>
            <tr className="comment-user">
              <td>
                <strong className="comment-username">
                  {comment.commentUser} says:
                </strong>
              </td>
              <td>
                <button
                  id={comment._id}
                  onClick={(e) => handleClick(e)}
                  className="btn submit-button ms-auto"
                  type="button"
                >
                  Delete Comment
                </button>
              </td>
            </tr>
            <tr className="comment-text">
              <td>{comment.commentText}</td>
            </tr>
          </tbody>
        );
      });
      return displayedComments;
    } else {
      return (
        <ul>
          <li>comments</li>
        </ul>
      );
    }
  };
  return renderComments();
};

export default CommentsDiplay;
