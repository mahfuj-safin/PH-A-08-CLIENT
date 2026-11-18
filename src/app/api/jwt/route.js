import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to generate token" },
      { status: 500 }
    );
  }
}