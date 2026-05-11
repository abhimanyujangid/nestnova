import type { ZodError, ZodIssue } from 'zod';

export class ConfigValidationError extends Error {
  readonly issues: readonly ZodIssue[];

  constructor(issues: readonly ZodIssue[]) {
    super(formatValidationError(issues));
    this.name = 'ConfigValidationError';
    this.issues = issues;
  }

  static fromZodError(error: ZodError): ConfigValidationError {
    return new ConfigValidationError(error.issues);
  }
}

export function formatValidationError(issues: readonly ZodIssue[]): string {
  const details = issues.map(formatIssue).join('\n');

  return `Invalid environment configuration:\n${details}`;
}

function formatIssue(issue: ZodIssue): string {
  const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';

  return `- ${path}: ${issue.message}`;
}
