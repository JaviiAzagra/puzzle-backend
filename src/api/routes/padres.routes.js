const express = require("express");
const Padre = require("../models/padres.model");
const bcrypt = require("bcrypt");
const { generateSign } = require("../../utils/jwt/jwt");
const { isAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allPadres = await Padre.find()
      .lean()
    return res.status(200).json(allPadres);
  } catch (error) {
    return res.status(500).json("Error al leer los usuarios");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const getPadre = await Padre.findById(id).populate({
      path: "favorites",
      populate: { path: "info" },
    });
    return res.status(200).json(getPadre);
  } catch (error) {
    return res.status(500).json("Error al leer el usuario");
  }
});

router.post("/register", async (req, res) => {
  try {
    const newPadre = new Padre(req.body);
    const createdPadre = await newPadre.save();
    return res.status(201).json(createdPadre);
  } catch (error) {
    return res.status(500).json("No se ha podido crear el usuario");
  }
});

router.post("/login", async (req, res) => {
  try {
    const padreDb = await Padre.findOne({ email: req.body.email }).populate({
      path: "favorites",
      populate: { path: "info" },
    });
    if (!padreDb) {
      return res.status(404).json("No existe el usuario");
    }
    if (bcrypt.compareSync(req.body.password, padreDb.password)) {
      const token = generateSign(padreDb._id, padreDb.email);
      return res.status(200).json({ token, padreDb });
    } else {
      return res.status(500).json("La contraseña no coincide");
    }
  } catch (error) {
    return res.status(500).json("Error al loguear el usuario");
  }
});

router.post("/logout", async (req, res) => {
  try {
    const token = null;
    return res.status(200).json(token);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.put("/edit/:id", async (req, res) => {
  console.log(req.body);
  try {
    const id = req.params.id;
    const modifiedPadre = new Padre(req.body);
    modifiedPadre._id = id;
    const updatedPadre = await Padre.findByIdAndUpdate(id, modifiedPadre);
    return res.status(200).json(updatedPadre);
  } catch (error) {
    return res.status(500).json("Error al modificar el usuario", error);
  }
});

router.post("/checksession", [isAuth], async (req, res, next) => {
  console.log(req.headers.authorization);
  try {
    const getPadre = await Padre.findById(req.padre._id).populate("favorites");
    return res.status(200).json(getPadre);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;