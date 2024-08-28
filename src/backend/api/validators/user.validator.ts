import Joi from "joi";

export const userLoginValidator = Joi.object({
    u_email :  Joi.string().email().required(),
    u_password : Joi.string().min(6).required(),
}).unknown(false);

export const userJoinValidator = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().min(6).required(),
    name : Joi.string().min(2).max(20).required(),
}).unknown(false);