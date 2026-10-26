import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function PrivacyModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-ink/60 flex items-end md:items-center justify-center p-0 md:p-6"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.6 }}
            transition={{ duration: 0.35, ease: [0.2, 0.6, 0.2, 1] }}
            className="w-full md:max-w-lg max-h-[88vh] overflow-y-auto bg-paper border-2 border-ink relative"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border-2 border-ink bg-paper hover:bg-yellow"
            >
              <X size={16} />
            </button>

            <div className="p-6 md:p-8">
              <div className="font-mono text-xs uppercase tracking-widest text-blue mb-2">Legal</div>
              <h3 className="font-display text-3xl md:text-4xl mb-1">Privacy Policy</h3>
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted mb-6">
                Last updated: October 2026
              </p>

              <div className="space-y-5 text-sm text-ink-soft leading-relaxed">
                <p>
                  This policy explains what happens to your information when you visit
                  or use this website (beepeelabs.cv), operated by Bakare Oluwaferanmi.
                </p>

                <div>
                  <h4 className="font-display text-lg text-ink mb-1.5">What I collect</h4>
                  <p>
                    The contact form on this site asks for your name, email address, and
                    a description of your project. These details are used to reply to
                    your enquiry. Pentreeform processes the submission and delivery of
                    contact form messages. Cloudflare Turnstile checks form submissions for spam. WhatsApp and email links let you contact me
                    through those services instead.
                  </p>
                </div>

                <div>
                  <h4 className="font-display text-lg text-ink mb-1.5">Cookies and tracking</h4>
                  <p>
                    The site uses Vercel Analytics and aggregate Firebase counters for
                    page views and contact actions, such as clicking WhatsApp or email
                    and submitting the contact form. The contact-action counters do not
                    include your name, email address, message, query strings or referrer
                    URLs. They measure website use, not completed conversations or sales.
                  </p>
                </div>

                <div>
                  <h4 className="font-display text-lg text-ink mb-1.5">Third-party links</h4>
                  <p>
                    This site links out to external platforms such as GitHub, LinkedIn,
                    Instagram, X, and WhatsApp. Those platforms have their own privacy policies,
                    and I'm not responsible for how they handle your data.
                  </p>
                </div>

                <div>
                  <h4 className="font-display text-lg text-ink mb-1.5">Your messages</h4>
                  <p>
                    Messages sent through the form are processed by Pentreeform and may
                    also be held in the email inbox used to answer enquiries. Contact me
                    if you want to ask about a message you have sent.
                  </p>
                </div>

                <div>
                  <h4 className="font-display text-lg text-ink mb-1.5">Your rights</h4>
                  <p>
                    You can ask me to delete any information you've sent through the
                    contact form at any time by emailing bakareferanmi96@gmail.com.
                  </p>
                </div>

                <div>
                  <h4 className="font-display text-lg text-ink mb-1.5">Contact</h4>
                  <p>
                    Questions about this policy can be sent to{' '}
                    <a href="mailto:bakareferanmi96@gmail.com" className="text-blue underline">
                      bakareferanmi96@gmail.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
