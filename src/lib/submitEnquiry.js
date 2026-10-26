export const CONTACT_FORM_ENDPOINT = 'https://pentreeform.vercel.app/f/da6905b6d1a1416691ebaaf5f5fb6289'
// Public widget key from Pentreeform's /api/config. No secret belongs in the client.
export const CONTACT_TURNSTILE_SITE_KEY = '0x4AAAAAAFmfScjhtwVx_3ig'

export async function submitEnquiry(form, send = fetch) {
  const fields = Object.fromEntries(['name', 'email', 'project'].map((key) => [key, String(form[key] || '').trim()]))
  if (!fields.name || !fields.project || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    throw new Error('Please enter your name, a valid email address and a project description.')
  }
  const token = String(form['cf-turnstile-response'] || '').trim()
  if (!token) throw new Error('Please complete the security check before sending your message.')
  const response = await send(CONTACT_FORM_ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: fields.name, email: fields.email, message: fields.project, 'cf-turnstile-response': token, _gotcha: String(form._gotcha || '') }),
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) throw new Error(result?.error || 'The form could not be submitted. Please try WhatsApp or email.')
  if (result?.ok !== true || typeof result.id !== 'string' || !result.id) {
    throw new Error('Your submission could not be confirmed. Please try WhatsApp or email.')
  }
}
