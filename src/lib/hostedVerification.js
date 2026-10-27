// Verification stays on Pentreeform's origin. Only a confirmation from this
// exact iframe and ticket can mark a message as saved.
export function openHostedVerification(address, endpoint) {
  const url = new URL(address)
  const target = new URL(endpoint)
  const prefix = target.pathname + '/verify/'
  const ticket = url.pathname.slice(prefix.length)
  if (url.origin !== target.origin || !url.pathname.startsWith(prefix) || !/^[a-f0-9]{64}$/.test(ticket) || url.username || url.password) {
    throw new Error('The verification link could not be confirmed. Please use WhatsApp or email.')
  }
  url.search = '?mode=embed'
  url.hash = ''
  return new Promise((resolve, reject) => {
    const previousFocus = document.activeElement
    const dialog = document.createElement('dialog')
    dialog.setAttribute('aria-label', 'Verify and send your message')
    dialog.style.cssText = 'width:min(440px,calc(100% - 32px));max-height:90dvh;box-sizing:border-box;border:2px solid #14120e;padding:0;background:white;color:#14120e;'
    const close = document.createElement('button')
    close.type = 'button'
    close.textContent = 'Close verification'
    close.style.cssText = 'display:block;margin:12px 12px 0 auto;padding:8px 12px;background:#f7f4ec;border:1px solid #14120e;cursor:pointer;'
    const frame = document.createElement('iframe')
    frame.title = 'Pentreeform message verification'
    frame.src = url.href
    frame.referrerPolicy = 'no-referrer'
    frame.style.cssText = 'display:block;width:100%;height:430px;max-height:75dvh;border:0;'
    let finished = false
    let timeout
    function finish(error, result) {
      if (finished) return
      finished = true
      clearTimeout(timeout)
      window.removeEventListener('message', receive)
      dialog.remove()
      previousFocus?.focus?.()
      if (error) reject(error)
      else resolve(result)
    }
    function receive(event) {
      if (event.origin !== target.origin || event.source !== frame.contentWindow || event.data?.type !== 'pentreeform:verified' || event.data.ticket !== ticket) return
      if (typeof event.data.id !== 'string' || !/^[a-f0-9]{32}$/.test(event.data.id)) return
      finish(null, { ok: true, id: event.data.id })
    }
    const cancel = () => finish(new Error('Verification closed before your message could be confirmed. You can try again.'))
    close.addEventListener('click', cancel)
    dialog.addEventListener('cancel', event => { event.preventDefault(); cancel() })
    frame.addEventListener('error', () => finish(new Error('Verification could not load. Please try again or use WhatsApp or email.')))
    dialog.append(close, frame)
    window.addEventListener('message', receive)
    document.body.append(dialog)
    timeout = setTimeout(() => finish(new Error('Verification expired. Please try again.')), 10 * 60 * 1000)
    if (typeof dialog.showModal === 'function') dialog.showModal()
    else {
      dialog.setAttribute('open', '')
      dialog.style.position = 'fixed'
      dialog.style.inset = '10% 0 auto'
      dialog.style.zIndex = '1000'
    }
    close.focus()
  })
}
