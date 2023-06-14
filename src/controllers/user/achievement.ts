import { Request, Response } from "express";
import { userModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";
import { apiResponse } from "../../common";
const ObjectId = require("mongoose").Types.ObjectId


export const get_by_id_achievement = async (req: Request, res: Response) => {
    reqInfo(req);
    let { id } = req.params, { page, limit } = req.body;
    try {
      const user = await userModel.findOne({ _id: ObjectId(id), isActive: true }, {});
      if (!user)return res.status(400).json(new apiResponse(400, responseMessage?.getDataNotFound("user"), {}, {}));
      
      const achievements = user.achievements;
      const startIndex = (page - 1) * limit;
      
      const paginatedAchievements = await userModel
        .find({ _id: ObjectId(id), isActive: true })
        .select('achievements')
        .slice('achievements', [startIndex, startIndex + limit])
        .sort({ createdAt: -1 })
      
      const Count = achievements.length;
  
      return res.status(200).json(new apiResponse(200,responseMessage?.getDataSuccess("achievement"),{
        achievements: paginatedAchievements[0].achievements,state: 
        {        
            page,        
            limit,        
            page_limit: Math.ceil(Count / limit) || 1      
        },    
    },{}  ));
    } catch (error) {
      console.log(error);
      return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
  };
  