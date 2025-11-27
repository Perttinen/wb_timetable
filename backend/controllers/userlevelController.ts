import { Response } from "express";
import asyncHandler from "express-async-handler";

import { Userlevel } from "../../database/models";
import { userlevelTypes } from "../../types";
import { Op } from "@sequelize/core";

// @desc get all userlevels
// @route GET /userlevel/
// @access admin
const getUserlevels = asyncHandler(
  async (_req, res: Response<userlevelTypes.TUserlevel[]>) => {
    const userlevels = await Userlevel.findAll({
      where: { userlevel: { [Op.not]: "hal" } },
    });

    res.status(200).json(userlevels.map((ul) => ul.toJSON()));
  }
);

export default { getUserlevels };
