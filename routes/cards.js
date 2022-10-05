var express = require("express");
var router = express.Router();
const Card = require("../models/Card");
const User = require("../models/User");
const passport = require("passport");
const passportService = require("../authentication/passport");
const List = require("../models/List");
const requireAuth = passport.authenticate("jwt", { session: false });
const {
  createActivityLog,
  createComment,
} = require("../util/cardActivityLogCreator");
const { ObjectId } = require("mongodb");

router
  .get("/:cardId", requireAuth, function (req, res, next) {
    const cardId = req.params.cardId;
    Card.findById(cardId).exec((err, card) => {
      if (err) {
        res.status(400).send(err);
        return next(err);
      } else {
        res.status(200).send(card).end();
      }
    });
  })
  .delete("/:cardId", requireAuth, async function (req, res, next) {
    const cardId = req.params.cardId;
    const { listId } = req.body;
    const listWithRemovedCard = await Card.findByIdAndDelete(cardId).exec(
      (err) => {
        if (err) {
          res.status(400).send(err);
          return next(err);
        }
        updatedList = List.findOne({ _id: listId })
          .populate("cards")
          .exec((err, list) => {
            if (err) return next(err);
            console.log(list);
            res.status(200).send(list).end();
          });
      }
    );
  })

  // POST add new card
  .post("/", requireAuth, async function (req, res, next) {
    const { listId, cardTitle, cardLabel, cardDescription } = req.body;
    const listWithNewCard = await new Card({
      cardTitle,
      cardLabel,
      cardDescription,
    }).save((err, card) => {
      if (err) return next(err);
      updatedList = List.findOneAndUpdate(
        { _id: listId },
        { $push: { cards: [card._id] } },
        { new: true }
      )
        .populate("cards")
        .exec((err, list) => {
          if (err) return next(err);
          res.status(200).send(list).end();
        });
    });
  })

  .put("/:cardId", requireAuth, async function (req, res, next) {
    const cardId = req.params.cardId;
    const {
      listId,
      cardTitle,
      cardLabel,
      cardDescription,
      cardComment,
      username,
    } = req.body;

    List.findById(listId).exec((err, list) => {
      if (err) return next(err);

      const activtyLog = createActivityLog(username, "saved to", list.listName);
      const comment = createComment(username, cardComment);
      console.log(activtyLog);

      const update = {
        cardTitle: cardTitle,
        cardLabel: cardLabel,
        cardDescription: cardDescription,
      };

      const filter = { _id: cardId };
      Card.findOneAndUpdate(filter, update, {
        new: true,
      })
        .updateOne({ $push: { cardComments: comment } })
        .updateOne({ $push: { cardActivity: activtyLog } })
        .exec((err) => {
          if (err) {
            res.status(400).send(err);
            return next(err);
          } else {
            updatedList = List.findOne({ _id: listId })
              .populate("cards")
              .exec((err, list) => {
                if (err) return next(err);
                res.status(200).send(list);
              });
          }
        });
    });
  })

  .delete(
    "/:cardId/comment/:commentId",
    requireAuth,
    async function (req, res, next) {
      const cardId = req.params.cardId;
      const commentId = req.params.commentId;
      const card = await Card.findById(cardId);
      let newCommentArray = [];
      card.cardComments.filter((comment) => {
        if (comment._id != commentId) {
          newCommentArray.push(comment);
        }
      });
      card.cardComments = newCommentArray;
      await card.save();
      res.send(card).status(204).end();
    }
  )

  .put("/:cardId/updatetitle", requireAuth, async function (req, res, next) {
    const cardId = req.params.cardId;
    const { username, newCardTitle } = req.body;
    const activityLog = createActivityLog(username, "changed");
    const filter = { _id: cardId };
    const update = { cardTitle: newCardTitle, cardActivity: activityLog };
    Card.findOneAndUpdate(filter, update).exec((err) => {
      if (err) {
        res.status(400).send(err);
        return next(err);
      } else {
        updatedCard = Card.findOne({ _id: cardId }).exec((err, card) => {
          if (err) {
            return next(err);
          } else {
            res.status(200).send(card);
          }
        });
      }
    });
  })
  .post("/:cardId/comment", requireAuth, async function (req, res, next) {
    const cardId = req.params.cardId;
    const { username, commentText } = req.body;
    const newComment = createComment(username, commentText);
    const activityLog = createActivityLog(username, "created");
    const filter = { _id: cardId };
    const update = {
      $push: { cardComments: newComment, cardActivity: activityLog },
    };
    Card.findOneAndUpdate(filter, update).exec((err) => {
      if (err) {
        res.status(400).send(err);
        return next(err);
      } else {
        updatedCard = Card.findOne({ _id: cardId }).exec((err, card) => {
          if (err) {
            return next(err);
          } else {
            res.status(200).send(card);
          }
        });
      }
    });
  })

  .put(
    "/:cardId/comment/:commentId",
    requireAuth,
    async function (req, res, next) {
      const cardId = req.params.cardId;
      const commentId = req.params.commentId;
      const { username, commentText } = req.body;
      const activtyLog = createActivityLog(username, "updated");
      Card.findById(cardId)
        .updateOne({ $push: { cardActivity: activtyLog } })
        .exec();
      const card = await Card.findById(cardId);
      card.cardComments.map((com) => {
        if (com._id == commentId) {
          com.commentText = commentText;
        }
      });
      await card.save();
      res.send(card).status(204);
    }
  );

module.exports = router;
