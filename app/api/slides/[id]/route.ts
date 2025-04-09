import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSlideById, updateSlide, deleteSlide } from "@/lib/slides";

// GET a specific slide
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const slide = getSlideById(params.id);
    
    if (!slide) {
      return NextResponse.json(
        { error: "Slide not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(slide);
  } catch (error) {
    console.error("Error fetching slide:", error);
    return NextResponse.json(
      { error: "Failed to fetch slide" },
      { status: 500 }
    );
  }
}

// PUT to update a slide
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    const slide = updateSlide(params.id, {
      title,
      description,
      imageUrl,
      buttonText,
      buttonLink,
      order,
      active,
    });
    
    if (!slide) {
      return NextResponse.json(
        { error: "Slide not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(slide);
  } catch (error) {
    console.error("Error updating slide:", error);
    return NextResponse.json(
      { error: "Failed to update slide" },
      { status: 500 }
    );
  }
}

// DELETE a slide
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const success = deleteSlide(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: "Slide not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Slide deleted successfully" });
  } catch (error) {
    console.error("Error deleting slide:", error);
    return NextResponse.json(
      { error: "Failed to delete slide" },
      { status: 500 }
    );
  }
}
