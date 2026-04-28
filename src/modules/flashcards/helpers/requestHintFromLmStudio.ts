type RequestHintParams = {
  term: string
  termLanguage: 'nl' | 'en'
}

type ChatCompletionChoice = {
  message?: {
    content?: string
  }
}

type ChatCompletionResponse = {
  choices?: ChatCompletionChoice[]
}

const DEFAULT_LM_STUDIO_BASE_URL = 'http://127.0.0.1:1234'
const DEFAULT_LM_STUDIO_MODEL = 'local-model'
const DEFAULT_TIMEOUT_MS = 15000

function getLmStudioConfig() {
  const baseUrl = (import.meta.env.VITE_LM_STUDIO_BASE_URL as string | undefined)?.trim()
  const model = (import.meta.env.VITE_LM_STUDIO_MODEL as string | undefined)?.trim()

  return {
    endpoint: `${baseUrl || DEFAULT_LM_STUDIO_BASE_URL}/v1/chat/completions`,
    model: model || DEFAULT_LM_STUDIO_MODEL,
  }
}

function buildHintPrompt(term: string, termLanguage: 'nl' | 'en') {
  const languageLabel = termLanguage === 'nl' ? 'Nederlands' : 'Engels'
  return [
    `De student ziet de term in ${languageLabel}: "${term}".`,
    'Geef precies 1 korte hint (maximaal 2 zinnen).',
    'Noem niet letterlijk de definitie en geef niet het volledige antwoord weg.',
    'Geen opsomming, alleen platte tekst.',
  ].join(' ')
}

function getHintFromResponse(payload: ChatCompletionResponse): string {
  const hint = payload.choices?.[0]?.message?.content?.trim()
  if (!hint) {
    throw new Error('Geen hint ontvangen van LM Studio.')
  }
  return hint
}

export async function requestHintFromLmStudio({
  term,
  termLanguage,
}: RequestHintParams): Promise<string> {
  const { endpoint, model } = getLmStudioConfig()
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content:
              'Je bent een tutor voor flashcards. Je antwoordt kort en helpt de student op weg zonder het antwoord te verraden.',
          },
          {
            role: 'user',
            content: buildHintPrompt(term, termLanguage),
          },
        ],
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`LM Studio gaf status ${response.status}.`)
    }

    const payload = (await response.json()) as ChatCompletionResponse
    return getHintFromResponse(payload)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Hint opvragen duurde te lang. Controleer of LM Studio draait.')
    }

    if (error instanceof Error) {
      throw new Error(
        `Hint kon niet worden opgehaald. Controleer LM Studio en CORS-instellingen. (${error.message})`,
      )
    }

    throw new Error('Hint kon niet worden opgehaald. Controleer LM Studio.')
  } finally {
    window.clearTimeout(timeout)
  }
}
