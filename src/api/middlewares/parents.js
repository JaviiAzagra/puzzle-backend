const Parent = require("../models/padres.model");
const { verifyJwt } = require("../../utils/jwt/jwt");

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next("Unauthorized");
    }
    const parsedToken = token.replace("Bearer ", "");
    const validToken = verifyJwt(parsedToken);
    const parentLogged = await Parent.findById(validToken.id);
    parentLogged.password = null;
    req.parent = parentLogged;
    next();
  } catch (error) {
    return next("Error");
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next("Unauthorized");
    }
    const parsedToken = token.replace("Bearer ", "");
    const validToken = verifyJwt(parsedToken);
    const parentLogged = await Parent.findById(validToken.id);

    if (parentLogged.rol === "admin") {
      parentLogged.password = null;
      req.parent = parentLogged;
      next();
    } else {
      return next("You're not an admin!");
    }
  } catch (error) {
    return next("Error");
  }
};

const isDoctor = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next("Unauthorized");
    }
    const parsedToken = token.replace("Bearer ", "");
    const validToken = verifyJwt(parsedToken);
    const parentLogged = await Parent.findById(validToken.id);

    if (parentLogged.rol === "doctor") {
      parentLogged.password = null;
      req.parent = parentLogged;
      next();
    } else {
      return next("You're not a !");
    }
  } catch (error) {
    return next("Error");
  }
};

module.exports = { isAuth, isAdmin, isDoctor };
