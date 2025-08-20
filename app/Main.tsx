'use client'

import { motion } from 'framer-motion'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import { useState } from 'react'
import NewsletterForm from 'pliny/ui/NewsletterForm'

const MAX_DISPLAY = 5

const images = [
  '/static/images/image_carrousel_1.png',
  '/static/images/image_carrousel_2.png',
  '/static/images/image_carrousel_3.png',
]

export default function Home({ posts }) {
  const [current, setCurrent] = useState(0)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<null | 'loading' | 'success' | 'error'>(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
        setMessage('')
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  // Cambiar de imagen cada 8s
  useState(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 8000)
    return () => clearInterval(interval)
  })

  return (
    <>
      {/* Hero */}
      <section className="relative grid w-full grid-cols-1 py-20 font-sans md:grid-cols-2">
        {/* Carrusel */}
        <div className="flex h-96 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-50 shadow-xl dark:bg-gray-900">
          <motion.img
            key={current}
            src={images[current]}
            alt="Portfolio slide"
            className="h-full w-full object-cover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* Texto */}
        <motion.div
          className="flex flex-col items-center justify-center px-6 text-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src="/static/images/avatar.png"
            alt="My Avatar"
            className="mb-6 h-32 w-32 rounded-full border-4 border-emerald-500 shadow-xl md:h-40 md:w-40"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          />

          <motion.h1
            className="mb-4 text-5xl font-extrabold text-emerald-600 md:text-6xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Welcome to my Portfolio
          </motion.h1>

          <motion.p
            className="mb-2 text-lg text-gray-700 md:text-xl dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1.2 }}
          >
            Explore my projects, skills, and professional journey.
          </motion.p>
          <motion.p
            className="text-lg text-gray-700 md:text-xl dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1.2 }}
          >
            Browse through my work and see my expertise in web development and design.
          </motion.p>
        </motion.div>
      </section>

      {/* Recent Posts */}
      <div className="mt-20 divide-y divide-gray-200 font-sans dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">
            Recent Posts
          </h2>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post, index) => {
            const { slug, date, title, summary, tags } = post
            return (
              <motion.li
                key={slug}
                className="py-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <article className="space-y-4 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                    </dd>
                  </dl>
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-semibold tracking-tight">
                          <Link
                            href={`/blog/${slug}`}
                            className="text-gray-900 transition hover:text-emerald-500 dark:text-gray-100"
                          >
                            {title}
                          </Link>
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Tag key={tag} text={tag} />
                          ))}
                        </div>
                      </div>
                      <p className="prose max-w-none text-gray-600 dark:text-gray-400">{summary}</p>
                    </div>
                    <div className="text-base font-medium">
                      <Link
                        href={`/blog/${slug}`}
                        className="text-emerald-500 transition hover:text-emerald-600 dark:hover:text-emerald-400"
                        aria-label={`Read more: "${title}"`}
                      >
                        Show more &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              </motion.li>
            )
          })}
        </ul>
      </div>

      {posts.length > MAX_DISPLAY && (
        <div className="mt-6 flex justify-end text-base font-medium">
          <Link
            href="/blog"
            className="text-emerald-500 transition hover:text-emerald-600 dark:hover:text-emerald-400"
            aria-label="All posts"
          >
            Every post &rarr;
          </Link>
        </div>
      )}

      {/* Contact */}
      <section className="mt-20 rounded-xl bg-gray-50 py-12 font-sans shadow-xl dark:bg-gray-900">
        <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Contact Me
        </h2>

        <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4 px-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 dark:bg-gray-800 dark:text-white"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            required
            rows={5}
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 dark:bg-gray-800 dark:text-white"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-lg bg-emerald-500 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-600 disabled:opacity-70"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </motion.button>

          {status === 'success' && (
            <p className="mt-3 text-center font-medium text-green-600">
              ✅ Your message has been sent successfully!
            </p>
          )}
          {status === 'error' && (
            <p className="mt-3 text-center font-medium text-red-600">
              ❌ Something went wrong. Please try again.
            </p>
          )}
        </form>
      </section>

      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-12">
          {' '}
          <NewsletterForm />{' '}
        </div>
      )}
    </>
  )
}
