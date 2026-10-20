import { createContext, useContext } from 'react'

export const PublicContentContext = createContext({})
export const usePublicContent = () => useContext(PublicContentContext)
