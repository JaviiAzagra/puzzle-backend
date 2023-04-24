const moongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = moongoose.Schema;

const userSchema = new Schema(
  {
    userName: { type: String, required: true, trim: true, unique: true },
    img: {
      type: String,
      default:
        "https://www.citypng.com/public/uploads/preview/download-profile-user-round-orange-icon-symbol-png-11639594360ksf6tlhukf.png",
    },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    favorites: [{ type: moongoose.Schema.Types.ObjectId, ref: "movies" }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

const User = moongoose.model("users", userSchema);
module.exports = User;
