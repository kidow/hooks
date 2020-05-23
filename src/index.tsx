import { ChangeEvent, useState, useCallback, useEffect } from "react"
import { useLocation, useHistory } from "react-router-dom"
import queryString from 'query-string'

export function useObject<T = {}>(
  initialObject: T
): [T, (obj: Partial<T>) => void, (e: ChangeEvent<HTMLInputElement>) => void] {
  const [state, setState] = useState<T>(initialObject)
  const onChange = useCallback(
    (obj: Partial<T>) => setState((prevState) => ({ ...prevState, ...obj })),
    [state]
  )
  const onEventChange = useCallback(
    ({ target: { name, value } }: ChangeEvent<HTMLInputElement>): void =>
      setState((prevState) => ({ ...prevState, [name]: value })),
    [state]
  )
  return [state, onChange, onEventChange]
}

export function useQuery<T = {}>(): {
  query: Partial<T>
  updateQuery: (payload: Partial<T>) => void
} {
  const query = (queryString.parse(window.location.search) as unknown) as Partial<T>
  const { pathname } = useLocation()
  const { replace } = useHistory()
  const updateQuery = (payload: Partial<T>) => {
    const url = queryString.stringify({ ...query, ...payload })
    // @ts-ignore
    if (payload.keyword) replace(`${pathname}?${url}`)
    else window.history.replaceState({ data: url }, 'useQuery', `?${url}`)
  }
  return { query, updateQuery }
}

export function useRadio<T>(initialState: T): [T, (e: ChangeEvent<HTMLInputElement>) => void] {
  const [state, setState] = useState<T>(initialState)
  const onChange = useCallback(
    // @ts-ignore
    (e: ChangeEvent<HTMLInputElement>) => setState(Number(e.target.value)),
    [state]
  )
  return [state, onChange]
}

export function useObjectWithCallback<T>(
  initialObject: T,
  callback: any
): [T, (obj: Partial<T>) => void, (e: ChangeEvent<HTMLInputElement>) => void] {
  const [state, setState] = useState(initialObject)
  useEffect(() => callback(state), [state])
  const onChange = useCallback(
    (obj: Partial<T>) => setState((prevState) => ({ ...prevState, ...obj })),
    [state]
  )
  const onEventChange = useCallback(
    ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
      setState((prevState) => ({ ...prevState, [name]: value })),
    [state]
  )
  return [state, onChange, onEventChange]
}