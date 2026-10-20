export const CONTACT_FORM_ENDPOINT = 'https://formspree.io/f/mdaqgwno'

export async function submitEnquiry(form, send = fetch) {
  const payload = Object.fromEntries(['name', 'email', 'project'].map((key) => [key, String(form[key] || '').trim()]))
  if (!payload.name || !payload.project || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    throw new Error('Please enter your name, a valid email address and a project description.')
  }
  const response = await send(CONTACT_FORM_ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error('The form could not be submitted. Please try WhatsApp or email.')
}
