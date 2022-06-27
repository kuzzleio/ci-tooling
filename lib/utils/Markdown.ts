export function codeBlock (text: string, language?: string): string {
  return `\`\`\`${language || ''}\n${text}\n\`\`\``;
}