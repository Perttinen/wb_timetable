import { Response } from "express";
import asyncHandler from "express-async-handler";

import { Userlevel } from "../../database/models";
import { IUserlevel } from "../../typesFile";
import { Op } from "@sequelize/core";

const getUserlevels = asyncHandler(
  async (_req, res: Response<IUserlevel[]>) => {
    const userlevels = await Userlevel.findAll({
      where: { userlevel: { [Op.not]: "hal" } },
    });

    res.status(200).json(userlevels.map((ul) => ul.toJSON()));
  }
);

export default { getUserlevels };
