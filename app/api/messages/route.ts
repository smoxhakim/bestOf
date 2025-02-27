import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get("locale") || "en"

  try {
    const messages = (await import(`@/messages/${locale}.json`)).default
    return NextResponse.json(messages)
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error)
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 })
  }
}

