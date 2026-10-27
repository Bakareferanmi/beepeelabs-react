import { openHostedVerification } from './hostedVerification.js'

export const CONTACT_FORM_ENDPOINT = 'https://pentreeform.vercel.app/f/da6905b6d1a1416691ebaaf5f5fb6289'

export async function submitEnquiry(form, send = fetch, verify = openHostedVerification) {
  const fields = Object.fromEntries(['name', 'email', 'project'].map((key) => [key, String(form[key] || '').trim()]))
  if (!fields.name || !fields.project || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    throw new Error('Please enter your name, a valid email address and a project description.')
  }
  const response = await send(CONTACT_FORM_ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: fields.name, email: fields.email, message: fields.project, _gotcha: String(form._gotcha || ''), ...(form._submission_id ? { _submission_id: form._submission_id } : {}) }),
  })
  let result = await response.json().catch(() => null)
  if (!response.ok) throw new Error(result?.error || 'The form could not be submitted. Please try WhatsApp or email.')
  if (response.status === 202 && result?.verification_required === true && typeof result.verification_url === 'string') {
    result = await verify(result.verification_url, CONTACT_FORM_ENDPOINT)
  }
  if (result?.ok !== true || typeof result.id !== 'string' || !result.id) {
    throw new Error('Your submission could not be confirmed. Please try WhatsApp or email.')
  }
}
