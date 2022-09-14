import { validationResult } from "express-validator";

// если валидация прошла тогда иди дальше
export default (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    } 
    next();
}