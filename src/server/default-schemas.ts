import * as Joi from "@hapi/joi";

export const shTypeCreate = Joi.string().required().valid("full", "id", "fast");
export const shTypeUpdate = Joi.string().required().valid("full", "fast");
export const shTypeUpdate2 = Joi.string().required().valid("full", "id", "fast");
export const shNumber = Joi.number().required();

// generics

export const shID = Joi.object().keys({
  id: Joi.number()
});

export const shText = Joi.object().keys({
  id: Joi.string()
});

export const shDefaultIDs = Joi.object().keys({
  ids: Joi.array().items(shID).required()
});

export const shDefaultIDsAsText = Joi.object().keys({
  ids: Joi.array().items(shText).required()
});

// create

export const shDefaultTypeCreate = Joi.object().keys({
  type: shTypeCreate
});

// update

export const shDefaultTypeUpdate = Joi.object().keys({
  type: shTypeUpdate
});

export const shDefaultTypeUpdate2 = Joi.object().keys({
  type: shTypeUpdate2
});
