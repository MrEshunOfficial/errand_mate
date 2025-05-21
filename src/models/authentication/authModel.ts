import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface UserDocument extends Document {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  providerId?: string;
  provider?: string;
  isOAuthUser: () => boolean;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  logState: () => void;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Invalid email address"],
  },
  password: {
    type: String,
    required: function (this: UserDocument) {
      const isOAuth = !!this.providerId && !!this.provider;
      console.log("Password required check:", {
        isOAuth,
        providerId: this.providerId,
        provider: this.provider,
      });
      return !isOAuth;
    },
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  providerId: {
    type: String,
    default: null,
  },
  provider: {
    type: String,
    default: null,
  },
  forgotPasswordToken: {
    type: String,
    default: null,
  },
  forgotPasswordTokenExpires: {
    type: Date,
    default: null,
  },
  verifyToken: {
    type: String,
    default: null,
  },
  verifyTokenExpires: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") && this.password) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }

    this.updatedAt = new Date();

    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Unknown error occurred"));
    }
  }
});

userSchema.methods.isOAuthUser = function () {
  const isOAuth = Boolean(this.providerId && this.provider);
  return isOAuth;
};

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  try {
    const userPassword = this.get("password", null, { getters: false });

    if (!userPassword) {
      return false;
    }

    const isMatch = await bcrypt.compare(candidatePassword, userPassword);

    return isMatch;
  } catch {
    return false;
  }
};

userSchema.pre("findOne", function () {
  if (this.getOptions().passwordRequired) {
    this.select("+password");
  }
});

export const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);

declare module "mongoose" {
  interface QueryOptions {
    passwordRequired?: boolean;
  }
}
