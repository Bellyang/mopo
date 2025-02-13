import { checkbox as checkboxPrompt, confirm as confirmPrompt, input as inputPrompt, select as selectPrompt } from '@inquirer/prompts'

import { errorMessageCatch } from '@mopo/shared'

// Helper function to handle common error catching logic
async function handlePrompt<T>(promptFn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await promptFn()
  }
  catch (err: unknown) {
    const message = errorMessageCatch.toErrorWithMessage(err).message
    if (message.includes('User force closed'))
      return
    throw err
  }
}

export function input({ message, required, validate }:
{ message: string, required: boolean, validate: (value: string) => string | boolean | Promise<string | boolean> }) {
  return handlePrompt(() => inputPrompt({ message, required, validate }))
}

export function confirm({ message }: { message: string }) {
  return handlePrompt(() => confirmPrompt({ message }))
}

export function checkbox(message: string, choices: any, required?: boolean) {
  return handlePrompt(() => checkboxPrompt({ message, choices, required }))
}

export function select({
  message,
  choices,
  defaultValue,
}: {
  message: string
  choices: { name: string, value: string, description?: string }[]
  defaultValue?: string
}) {
  return handlePrompt(() => selectPrompt({ message, choices, default: defaultValue }))
}
