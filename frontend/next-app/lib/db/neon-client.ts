// Neon PostgreSQL Client
// Direct connection to Neon serverless PostgreSQL database
// Replaces Prisma for simpler operations
// This file should only be imported in Server Components or API Routes

import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// Type for SQL query results
type SqlResult = Record<string, unknown>[];

// Lazy-loaded sql client to avoid build-time connection errors
let sqlInstance: NeonQueryFunction<boolean, boolean> | null = null;

function getSql(): NeonQueryFunction<boolean, boolean> {
  if (!sqlInstance) {
    const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
    if (!dbUrl) {
      throw new Error('No database connection string was provided to neon(). Perhaps an environment variable has not been set?');
    }
    sqlInstance = neon(dbUrl);
  }
  return sqlInstance;
}

// Wrapper function for SQL queries with proper typing
async function sql(strings: TemplateStringsArray, ...values: unknown[]): Promise<SqlResult> {
  const sqlFn = getSql();
  const result = await sqlFn(strings, ...values);
  return result as SqlResult;
}

export interface Project {
  id: string;
  name: string;
  problemStatement: string;
  description?: string;
  template: string | null;
  createdAt: string;
  updatedAt: string;
  currentStep?: number;
  phase1Data?: {
    reframe: any | null;
    vision: any | null;
  };
  phase2Data?: {
    personas: any | null;
    questions: any | null;
  };
  phase3Data?: {
    marketAnalysis: any | null;
  };
  savedSessions?: SavedSession[];
  projectContext?: any;
  lastUpdated?: string;
  completedSteps?: number[];
}

export interface SavedSession {
  id: string;
  stepNumber: number;
  stepName: string;
  data: any;
  savedAt: string;
  name?: string;
}

// Initialize database tables
export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        problem_statement TEXT,
        description TEXT,
        template TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        current_step INTEGER DEFAULT 1,
        phase1_data JSONB DEFAULT '{}'::jsonb,
        phase2_data JSONB DEFAULT '{}'::jsonb,
        phase3_data JSONB DEFAULT '{}'::jsonb,
        saved_sessions JSONB DEFAULT '[]'::jsonb,
        project_context JSONB DEFAULT '{}'::jsonb,
        completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

// Project operations
export async function createProject(project: Omit<Project, 'createdAt' | 'updatedAt' | 'completedSteps' | 'savedSessions'>) {
  const result = await sql`
    INSERT INTO projects (
      id, 
      name, 
      problem_statement, 
      description, 
      template,
      current_step,
      phase1_data,
      phase2_data,
      phase3_data,
      project_context
    )
    VALUES (
      ${project.id}, 
      ${project.name}, 
      ${project.problemStatement}, 
      ${project.description}, 
      ${project.template},
      ${project.currentStep || 1},
      ${JSON.stringify(project.phase1Data || {})},
      ${JSON.stringify(project.phase2Data || {})},
      ${JSON.stringify(project.phase3Data || {})},
      ${JSON.stringify(project.projectContext || {})}
    )
    RETURNING *;
  `;
  return result[0] as unknown as Project;
}

export async function getProject(id: string): Promise<Project | null> {
  const result = await sql`
    SELECT * FROM projects WHERE id = ${id};
  `;
  if (!result[0]) return null;
  
  // Map snake_case DB columns to camelCase interface
  const row = result[0] as Record<string, unknown>;
  return {
    id: row.id,
    name: row.name,
    problemStatement: row.problem_statement,
    description: row.description,
    template: row.template,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    currentStep: row.current_step,
    phase1Data: row.phase1_data,
    phase2Data: row.phase2_data,
    phase3Data: row.phase3_data,
    savedSessions: row.saved_sessions,
    projectContext: row.project_context,
    completedSteps: row.completed_steps,
    lastUpdated: row.last_updated
  } as Project;
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const result = await sql`
    UPDATE projects
    SET
      name = COALESCE(${updates.name}, name),
      problem_statement = COALESCE(${updates.problemStatement}, problem_statement),
      description = COALESCE(${updates.description}, description),
      template = COALESCE(${updates.template}, template),
      current_step = COALESCE(${updates.currentStep}, current_step),
      phase1_data = COALESCE(${updates.phase1Data ? JSON.stringify(updates.phase1Data) : null}, phase1_data),
      phase2_data = COALESCE(${updates.phase2Data ? JSON.stringify(updates.phase2Data) : null}, phase2_data),
      phase3_data = COALESCE(${updates.phase3Data ? JSON.stringify(updates.phase3Data) : null}, phase3_data),
      saved_sessions = COALESCE(${updates.savedSessions ? JSON.stringify(updates.savedSessions) : null}, saved_sessions),
      project_context = COALESCE(${updates.projectContext ? JSON.stringify(updates.projectContext) : null}, project_context),
      completed_steps = COALESCE(${updates.completedSteps}, completed_steps),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *;
  `;
  return result[0] as unknown as Project;
}

export async function listProjects(): Promise<Project[]> {
  const result = await sql`
    SELECT * FROM projects ORDER BY created_at DESC;
  `;
  // Map snake_case DB columns to camelCase interface
  return (result as any[]).map(row => ({
    id: row.id,
    name: row.name,
    problemStatement: row.problem_statement,
    description: row.description,
    template: row.template,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    currentStep: row.current_step,
    phase1Data: row.phase1_data,
    phase2Data: row.phase2_data,
    phase3Data: row.phase3_data,
    savedSessions: row.saved_sessions,
    projectContext: row.project_context,
    completedSteps: row.completed_steps,
    lastUpdated: row.last_updated
  })) as unknown as Project[];
}

export async function deleteProject(id: string) {
  await sql`
    DELETE FROM projects WHERE id = ${id};
  `;
}

export { sql };
