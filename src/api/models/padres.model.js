const moongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = moongoose.Schema;

const padreSchema = new Schema(
  {
    padreName: { type: String, required: true, trim: true, unique: true },
    img: {type: String, default: "https://www.citypng.com/public/uploads/preview/download-profile-padre-round-orange-icon-symbol-png-11639594360ksf6tlhukf.png"},
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

padreSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

const Padre = moongoose.model("padres", padreSchema);
module.exports = Padre;
