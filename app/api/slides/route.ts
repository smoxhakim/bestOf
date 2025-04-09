import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSlides, createSlide } from "@/lib/slides";

// GET all slides
export async function GET() {
  try {
    const slides = getSlides();
    // Sort slides by order
    slides.sort((a, b) => a.order - b.order);
    
    return NextResponse.json(slides);
  } catch (error) {
    console.error("Error fetching slides:", error);
    return NextResponse.json(
      { error: "Failed to fetch slides" },
      { status: 500 }
    );
  }
}

// POST a new slide
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { title, description, imageUrl, buttonText, buttonLink, order, active } = await request.json();
    
    const slide = createSlide({
      title,
      description,
      imageUrl,
      buttonText,
      buttonLink,
      order: order || 0,
      active: active !== undefined ? active : true,
    });
    
    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error("Error creating slide:", error);
    return NextResponse.json(
      { error: "Failed to create slide" },
      { status: 500 }
    );
  }
}
