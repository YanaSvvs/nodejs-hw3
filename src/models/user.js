import { model, Schema } from 'mongoose';

const DEFAULT_AVATAR_URL = 'https://default-avatar-url.com/placeholder.png'; 
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    
    avatar: {
      type: String,
      
      default: DEFAULT_AVATAR_URL, 
    },
  },
  { timestamps: true },
);

userSchema.pre('save', function (next) {
  if (this.isNew && !this.username) {
    this.username = this.email;
  }
  next();
});

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export const User = model('User', userSchema);