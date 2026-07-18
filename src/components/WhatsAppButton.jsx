import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/2340000000000?text=Hi%20Bakare%2C%20I%20found%20your%20site%20and%20wanted%20to%20chat%20about%20a%20project."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.1, duration: 0.4, ease: [0.2, 0.6, 0.2, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 flex items-center justify-center bg-green border-2 border-ink text-paper shadow-[3px_3px_0_0_#14120E]"
    >
      <MessageCircle size={24} fill="currentColor" strokeWidth={0} />
    </motion.a>
  )
}
