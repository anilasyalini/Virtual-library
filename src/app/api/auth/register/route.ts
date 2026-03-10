import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, role} = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json(user);

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}