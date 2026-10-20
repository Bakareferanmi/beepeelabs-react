import { enquiryHref } from '../lib/enquiries.js'
import { trackLeadEvent } from '../lib/trackView.js'

export default function EnquiryLink({ channel = 'whatsapp', context, source, children, className, ...props }) {
  return (
    <a
      {...props}
      href={enquiryHref(channel, context)}
      target={channel === 'whatsapp' ? '_blank' : undefined}
      rel="noopener noreferrer"
      className={className}
      onClick={() => { void trackLeadEvent(channel === 'email' ? 'email_click' : 'whatsapp_click', source) }}
    >
      {children}
    </a>
  )
}
