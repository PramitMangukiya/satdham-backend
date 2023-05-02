"use strict"
import { Request, Router, Response } from 'express'
// import { userRouter } from './user'
import { userStatus } from '../common'
import { adminRouter } from './admin'
import { uploadRouter } from './upload'
import { facultyRouter } from './faculty'
import { userRouter } from './user'
// import { userRouter } from './user'



const router = Router()
const accessControl = (req: Request, res: Response, next: any) => {
    req.headers.userType = userStatus[req.originalUrl.split('/')[1]]
    next();
}

router.use("/upload" , accessControl ,uploadRouter )
router.use('/admin',  accessControl, adminRouter)
router.use('/faculty',  accessControl, facultyRouter)
router.use('/user',  accessControl, userRouter)



export { router }