'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabaseBrowser } from '../../../lib/supabase-client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setIsLoading(true)
      setErrorMessage('')

      const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password })
      if (error) throw error

      router.push('/admin')
      router.refresh()
    } catch {
      setErrorMessage('Nieprawidłowy email lub hasło')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <p className="mb-6 text-center text-2xl font-bold text-slate-900">Panel admina</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-700 focus:border-indigo-500 focus:outline-none"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Hasło</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-700 focus:border-indigo-500 focus:outline-none"
            />
          </label>

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Logowanie...' : 'Zaloguj'}
          </button>
        </form>
      </div>
    </div>
  )
}
