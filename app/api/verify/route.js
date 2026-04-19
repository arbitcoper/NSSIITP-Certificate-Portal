import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Parses the students CSV file.
 * Format: RollNo, Name  (header row present)
 * Returns an array of { rollNo, name }
 */
function loadStudents() {
  const filePath = join(process.cwd(), "data", "students.csv");
  const raw = readFileSync(filePath, "utf-8");

  return raw
    .split(/\r?\n/)
    .slice(1) // skip header row
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const commaIdx = line.indexOf(",");
      if (commaIdx === -1) return null;
      return {
        rollNo: line.slice(0, commaIdx).trim(),
        name: line.slice(commaIdx + 1).trim(),
      };
    })
    .filter(Boolean);
}

export async function POST(req) {
  let rollNo;

  try {
    ({ rollNo } = await req.json());
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!rollNo || typeof rollNo !== "string" || !rollNo.trim()) {
    return NextResponse.json(
      { success: false, error: "Roll number is required." },
      { status: 400 }
    );
  }

  let students;
  try {
    students = loadStudents();
  } catch (err) {
    console.error("Failed to read students.csv:", err);
    return NextResponse.json(
      { success: false, error: "Server error: could not load student data." },
      { status: 500 }
    );
  }

  const student = students.find(
    (s) => s.rollNo.toLowerCase() === rollNo.trim().toLowerCase()
  );

  if (!student) {
    return NextResponse.json(
      {
        success: false,
        error: `No participant found with Roll Number "${rollNo.trim()}". Please check and try again.`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    rollNo: student.rollNo,
    name: student.name,
  });
}
