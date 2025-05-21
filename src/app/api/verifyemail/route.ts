// src/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/authentication/authModel";
import { connect } from "@/lib/dbconfigue/dbConfigue";

connect();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;
    console.log(token);

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }
    console.log(user);
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpire = undefined;
    await user.save();
    return NextResponse.json(
      {
        message: "Email verified successfully",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
