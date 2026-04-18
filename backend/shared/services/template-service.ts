// Template Service - Loads and provides template content for AI generation
// Ensures AI outputs follow the structured templates defined in /pm-pilot/template/
// NOTE: This service should only be used server-side (API routes, server components)

import fs from "fs";
import path from "path";

const TEMPLATE_BASE_PATH = path.join(process.cwd(), "pm-pilot", "template");

export type TemplateName =
  | "chatprd"
  | "competitive"
  | "okr-metrics"
  | "persona"
  | "problem-statement"
  | "rice-scoring"
  | "roadmap"
  | "user-stories";

export interface TemplateContent {
  markdown: string;
  json?: Record<string, unknown>;
  variables: string[];
}

/**
 * Load template content by name
 * Returns markdown content and JSON schema if available
 */
export function loadTemplate(templateName: TemplateName): TemplateContent {
  const templatePath = path.join(TEMPLATE_BASE_PATH, getTemplateFolderName(templateName));
  
  // Load markdown template
  const markdownPath = path.join(templatePath, `${templateName}-template.md`);
  let markdown: string;
  try {
    markdown = fs.readFileSync(markdownPath, "utf-8");
  } catch (error) {
    console.warn(`Markdown template not found: ${markdownPath}`);
    markdown = "";
  }

  // Load JSON template (optional)
  const jsonPath = path.join(templatePath, `${templateName}-template.json`);
  let json: Record<string, unknown> | undefined;
  try {
    const jsonContent = fs.readFileSync(jsonPath, "utf-8");
    json = JSON.parse(jsonContent);
  } catch (error) {
    // JSON template is optional
  }

  // Extract variables from markdown ({{variableName}} pattern)
  const variables = extractVariables(markdown);

  return {
    markdown,
    json,
    variables,
  };
}

/**
 * Get all available templates
 */
export function getAllTemplates(): Record<TemplateName, TemplateContent> {
  const templates: TemplateName[] = [
    "chatprd",
    "competitive",
    "okr-metrics",
    "persona",
    "problem-statement",
    "rice-scoring",
    "roadmap",
    "user-stories",
  ];

  return templates.reduce((acc, name) => {
    acc[name] = loadTemplate(name);
    return acc;
  }, {} as Record<TemplateName, TemplateContent>);
}

/**
 * Build a prompt instruction that includes template guidance
 */
export function buildTemplateGuidance(
  templateName: TemplateName,
  section?: string
): string {
  const template = loadTemplate(templateName);
  
  let guidance = `\n\n=== TEMPLATE GUIDANCE ===\n`;
  guidance += `You MUST generate output following this template structure:\n\n`;
  
  if (section && template.json) {
    // Include specific section from JSON template
    const sectionData = template.json[section];
    if (sectionData) {
      guidance += `Template Section "${section}":\n${JSON.stringify(sectionData, null, 2)}\n\n`;
    }
  }

  // Include format instructions
  if (template.json?.["format"]) {
    guidance += `Format Requirements:\n${JSON.stringify(template.json["format"], null, 2)}\n\n`;
  }

  // Include example from template
  if (template.json?.["examples"] || template.json?.["priorities"] || template.json?.["personas"]) {
    const examples = template.json["examples"] || 
                     template.json["priorities"] || 
                     template.json["personas"];
    if (examples) {
      guidance += `Template Example Structure:\n${JSON.stringify(examples, null, 2).slice(0, 1000)}...\n\n`;
    }
  }

  // Include key variables that should be populated
  if (template.variables.length > 0) {
    guidance += `Key Template Variables to Populate:\n`;
    guidance += template.variables.slice(0, 20).map(v => `- ${v}`).join("\n");
    guidance += `\n\n`;
  }

  guidance += `IMPORTANT: Your response MUST match the structure, sections, and format defined in this template. Use the exact field names and nesting structure shown above.\n`;
  guidance += `========================\n`;

  return guidance;
}

/**
 * Get template-specific output schema for JSON validation
 */
export function getTemplateOutputSchema(templateName: TemplateName): string {
  const template = loadTemplate(templateName);
  
  if (template.json?.["schema"]) {
    return JSON.stringify(template.json["schema"], null, 2);
  }
  
  // Return default schemas based on template type
  switch (templateName) {
    case "persona":
      return getPersonaSchema();
    case "user-stories":
      return getUserStoriesSchema();
    default:
      return "{}";
  }
}

// Helper functions
function getTemplateFolderName(templateName: TemplateName): string {
  const folderMap: Record<TemplateName, string> = {
    "chatprd": "chatprd-template",
    "competitive": "competitive template",
    "okr-metrics": "okr-metrics-template",
    "persona": "persona-template",
    "problem-statement": "problem-statement-template",
    "rice-scoring": "rice-scoring template",
    "roadmap": "roadmap template",
    "user-stories": "user-stories template",
  };
  return folderMap[templateName];
}

function extractVariables(markdown: string): string[] {
  const matches = markdown.match(/\{\{(\w+)\}\}/g) || [];
  const variables = matches.map(m => m.replace(/\{\{|\}\}/g, ""));
  return [...new Set(variables)]; // Remove duplicates
}

function getPersonaSchema(): string {
  return `{
  "personas": [{
    "name": "string - realistic first name",
    "role": "string - job title or role",
    "bio": "string - 2-3 sentence background",
    "demographics": {
      "ageRange": "string",
      "location": "string",
      "education": "string",
      "incomeLevel": "string"
    },
    "painPoints": ["string"],
    "frustrations": ["string"],
    "goals": ["string"],
    "motivations": ["string"],
    "behaviors": ["string"],
    "interests": ["string"],
    "techSavviness": "low | medium | high",
    "quote": "string - representative quote"
  }]
}`;
}

function getUserStoriesSchema(): string {
  return `{
  "epics": [{
    "name": "string - epic title",
    "description": "string - epic description",
    "stories": [{
      "title": "string - story title",
      "description": "string - As a [user], I want [goal], so that [benefit]",
      "asA": "string - persona name",
      "iWant": "string - feature/action",
      "soThat": "string - benefit/outcome",
      "acceptanceCriteria": ["string - Given-When-Then format"],
      "storyPoints": "number (1,2,3,5,8,13)",
      "priority": "P0 | P1 | P2"
    }]
  }]
}`;
}
