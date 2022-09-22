import { format } from "date-fns";
import { RequestQuery } from "..";
import { Path } from "../models/Path";

export const updateComments = async (query: {
  [key: string]: string | number;
}) => {
  const {
    pathId,
    userId,
    comment,
    emoji,
    background,
    countryCode,
    countryName,
    city,
  } = query as RequestQuery;
  const topPaths = await Path.find();
  if (topPaths[0] && topPaths[0].paths) {
    const currentTopPaths = topPaths[0].paths;
    let currentTopPathsClone = [...currentTopPaths];
    const foundPathMatchIndex = currentTopPaths.findIndex(
      (el: { [key: string]: any }) => el._id.toString() === pathId
    );
    if (foundPathMatchIndex > -1) {
      const fullCommentObj: {
        userId: string;
        comment: string;
        emoji: string;
        background: string;
        countryCode: string;
        countryName: string;
        city: string;
        score: number;
        time: Date;
      } = {
        userId: userId.toString(),
        comment: comment.toString(),
        emoji: emoji.toString(),
        background: background.toString(),
        countryCode: countryCode.toString(),
        countryName: countryName.toString(),
        city: city.toString(),
        score: 0,
        time: new Date(),
      };
      const oldCommentsArr = currentTopPathsClone[foundPathMatchIndex].comments;
      const foundMatchingUserId = oldCommentsArr.find(
        (comment) => comment.userId === userId
      );
      if (foundMatchingUserId) {
        if (foundMatchingUserId.emoji && foundMatchingUserId.background) {
          fullCommentObj.emoji = foundMatchingUserId.emoji;
          fullCommentObj.background = foundMatchingUserId.background;
        }
      }
      currentTopPathsClone[foundPathMatchIndex].comments = [
        ...oldCommentsArr,
        fullCommentObj,
      ];
      const currentDate = format(new Date(), "MM/dd/yyyy");
      const topPathsFilter = { date: currentDate };
      const pathsUpdate = { paths: currentTopPathsClone };
      const updatedPathsObj = await Path.findOneAndUpdate(
        topPathsFilter,
        pathsUpdate,
        {
          returnOriginal: false,
        }
      );
      if (updatedPathsObj.paths) {
        const newFoundMatchIndex = updatedPathsObj.paths.findIndex(
          (el: { [key: string]: any }) => el._id.toString() === pathId
        );
        const foundUserComments = updatedPathsObj.paths[
          newFoundMatchIndex
        ].comments.filter(
          (comment: { [key: string]: string | number | Date }) =>
            comment.userId === userId
        );
        if (foundUserComments && foundUserComments.length > 0) {
          return foundUserComments[foundUserComments.length - 1]._id;
        }
      } else {
        return {};
      }
    }
  }
};
