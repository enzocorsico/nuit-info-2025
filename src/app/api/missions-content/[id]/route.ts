import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const filePath = join(
      process.cwd(),
      "src/data/missions-content",
      `${id}.json`
    );

    const fileContent = await readFile(filePath, "utf-8");
    const missionData = JSON.parse(fileContent);

    return NextResponse.json(missionData);
  } catch (error) {
    console.error("Failed to load mission:", error);
    return NextResponse.json(
      { error: "Mission not found" },
      { status: 404 }
    );
  }
}
