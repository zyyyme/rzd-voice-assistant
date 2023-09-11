const parseEnv  = (env: string) => env === 'true'

export const hasApiMocked = parseEnv(import.meta.env.VITE_HAS_API_MOCKED)
export const hasConversationMocked = parseEnv(import.meta.env.VITE_IS_MOCKED_CONVERSATION)