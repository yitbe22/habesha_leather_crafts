import { AnimatePresence, m } from 'framer-motion'
import { Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { SewnCheck } from '@/components/SewnCheck'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useSendContactMessage } from '@/hooks/useCatalog'
import { EASE_LUX } from '@/lib/motion'

const TOPICS = ['General question', 'Custom order', 'Help with an order', 'Wholesale']
const EMPTY = { name: '', contact: '', topic: TOPICS[0], message: '' }
const FIELDS = ['name', 'contact', 'message']

function validate(values) {
  const errors = {}
  const contact = values.contact.trim()
  if (!values.name.trim()) errors.name = 'Please tell us your name.'
  if (!contact) errors.contact = 'Add a phone number or email so we can reply.'
  else if (!/^\+?[\d\s()-]{7,}$/.test(contact) && !/^\S+@\S+\.\S+$/.test(contact)) errors.contact = 'That does not look like a phone number or email.'
  if (values.message.trim().length < 10) errors.message = 'A few more words, please (at least 10 characters).'
  return errors
}

/** Label, control and an error message wired together for screen readers. */
function Field({ id, label, error, children }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <m.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-destructive"
          >
            {error}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Contact form (demo). Errors show once a field has been left or the form
 * submitted; on submit the first problem field gets focus. Sending goes
 * through the service layer like everything else.
 */
export function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sentTo, setSentTo] = useState(null)
  const send = useSendContactMessage()

  const errors = validate(values)
  const errorFor = (field) => (touched[field] || submitted ? errors[field] : undefined)
  const bind = (field) => ({
    id: `contact-${field}`,
    value: values[field],
    onChange: (e) => setValues((v) => ({ ...v, [field]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [field]: true })),
    'aria-invalid': Boolean(errorFor(field)),
    'aria-describedby': errorFor(field) ? `contact-${field}-error` : undefined,
  })

  const onSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const firstInvalid = FIELDS.find((f) => errors[f])
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus()
      return
    }
    send.mutate(values, {
      onSuccess: () => {
        const name = values.name.trim().split(' ')[0]
        toast.success('Message sent', { description: `Thank you, ${name}. We usually reply within a day.` })
        setSentTo(name)
        setValues(EMPTY)
        setTouched({})
        setSubmitted(false)
      },
      onError: (error) => toast.error('Your message could not be sent', { description: error.message }),
    })
  }

  if (sentTo) {
    return (
      <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_LUX }} className="flex flex-col items-center py-10 text-center" role="status">
        <SewnCheck />
        <h3 className="text-subtitle mt-6">Thank you, {sentTo}</h3>
        <p className="mt-3 max-w-[36ch] text-muted-foreground">Your message is with the workshop. We will get back to you on the number or email you gave us.</p>
        <Button variant="outline" className="mt-8 rounded-full px-6" onClick={() => setSentTo(null)}>
          Send another message
        </Button>
      </m.div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-name" label="Your name" error={errorFor('name')}>
          <Input {...bind('name')} autoComplete="name" className="h-11 bg-background" />
        </Field>
        <Field id="contact-contact" label="Phone or email" error={errorFor('contact')}>
          <Input {...bind('contact')} autoComplete="email" inputMode="email" placeholder="+251… or you@example.com" className="h-11 bg-background" />
        </Field>
      </div>
      <Field id="contact-topic" label="What is it about?">
        <Select value={values.topic} onValueChange={(topic) => setValues((v) => ({ ...v, topic }))}>
          <SelectTrigger id="contact-topic" className="!h-11 w-full bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TOPICS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field id="contact-message" label="Message" error={errorFor('message')}>
        <Textarea {...bind('message')} rows={5} placeholder="Tell us what you are looking for: a piece, a colour, a size…" className="resize-y bg-background" />
      </Field>
      <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">Demo form: messages are not sent anywhere yet.</p>
        <Button type="submit" size="lg" className="h-12 rounded-full px-8" disabled={send.isPending}>
          <Send className="size-4" strokeWidth={1.6} />
          {send.isPending ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  )
}
