import { Fragment } from 'react'

/**
 * Splits text into masked words so a heading marked data-reveal="words"
 * can rise into place one word at a time.
 */
export function Words({ text }) {
  const parts = text.split(' ')
  return parts.map((part, i) => (
    <Fragment key={i}>
      <span className="word-mask">
        <span className="w" style={{ '--i': i }}>
          {part}
        </span>
      </span>
      {i < parts.length - 1 && ' '}
    </Fragment>
  ))
}
