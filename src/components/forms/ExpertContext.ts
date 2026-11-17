'use client'

import { createContext } from 'react'

/** The id of the expert the visitor is booking with, set by the consultation pop-up; `null` books with the office. */
export const ExpertContext = createContext<string | null>(null)
