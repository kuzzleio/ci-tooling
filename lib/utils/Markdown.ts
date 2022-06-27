export function codeBlock (text: string, language?: string): string {
  return `\`\`\`${language || ''}\n${text}\n\`\`\``;
}

export function backquote (text: string): string {
  return `\`${text}\``;
}