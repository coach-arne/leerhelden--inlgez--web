let mermaidInitialized = false

export async function loadMermaid() {
  const mermaid = (await import('mermaid')).default

  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'neutral',
    })
    mermaidInitialized = true
  }

  return mermaid
}
