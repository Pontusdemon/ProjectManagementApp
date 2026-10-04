const FALLBACK_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789"
const FALLBACK_LENGTH = 12

function randomFallbackId(): string {
    let id = ""

    for (let index = 0; index < FALLBACK_LENGTH; index += 1) {
        id += FALLBACK_ALPHABET[Math.floor(Math.random() * FALLBACK_ALPHABET.length)]
    }

    return id
}

export function createId(prefix: string): string {
  const uniquePart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : randomFallbackId()

  return `${prefix}-${uniquePart}`
}