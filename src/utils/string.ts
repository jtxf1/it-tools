export { isValidCode }

function isValidCode(code: string | null | undefined): boolean {
  return code != null && code.trim() !== '' && code.trim() !== 'null' && code.trim() !== ' ';
}