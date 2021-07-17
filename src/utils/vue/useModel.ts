export type CTXEMIT = (event: string, ...data: any[]) => void

export function useModel(ctxEmit: CTXEMIT, event: string) {
  if (!(event.trim() && event.startsWith("update:"))) return
  let data = ""

  const onInput = (e: InputEvent) => {
    const inputData = e.data

    const str = inputData === null ? data.substring(0, data.length - 1) : data += inputData
    data = str
    ctxEmit(event, str)
  }

  return onInput
}