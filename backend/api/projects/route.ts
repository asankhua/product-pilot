// Projects CRUD API
// POST: Create new project with problem statement
// GET: List all projects
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // TODO: Create project, initialize pipeline steps
  return new Response("Create project placeholder", { status: 501 });
}

export async function GET(req: NextRequest) {
  // TODO: List all projects with pipeline status
  return new Response("List projects placeholder", { status: 501 });
}
