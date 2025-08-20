'use client'

import { motion } from 'framer-motion'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import { useState } from 'react'

const MAX_DISPLAY = 5

// Carrusel simple
const images = [
  '/static/images/image_carrousel_1.png',
  '/static/images/image_carrousel_2.png',
  '/static/images/image_carrousel_3.png',
]

export default function Home({ posts }) {
  const [current, setCurrent] = useState(0)

  // Cambiar de imagen cada 3s
  useState(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 8000)
    return () => clearInterval(interval)
  })

  return (
    <>
      {/* Hero en 2 columnas */}
      <section className="relative grid w-full grid-cols-1 py-20 md:grid-cols-2">
        {/* Mitad izquierda: carrusel */}
        <div className="flex h-96 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-lg dark:bg-gray-900">
          <motion.img
            key={current}
            src={images[current]}
            alt="Portfolio slide"
            className="h-full w-full object-cover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* Mitad derecha: texto */}
        <motion.div
          className="flex flex-col items-center justify-center px-6 text-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src="/static/images/avatar.png"
            alt="My Avatar"
            className="mb-6 h-32 w-32 rounded-full border-4 border-green-500 shadow-lg md:h-40 md:w-40"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          />

          <motion.h1
            className="mb-4 text-5xl font-extrabold text-green-400 md:text-6xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Welcome to my portfolio
          </motion.h1>

          <motion.p
            className="mb-2 text-lg text-green-700 md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1.2 }}
          >
            Here you can explore my projects, skills, and professional journey.
          </motion.p>
          <motion.p
            className="text-lg text-green-700 md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1.2 }}
          >
            Feel free to browse through my work and learn more about my expertise in web development
            and design.
          </motion.p>
        </motion.div>
      </section>

      {/* Lista de posts */}
      <div className="mt-20 divide-y divide-gray-200 dark:divide-gray-700">
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
                        <h3 className="text-2xl font-bold tracking-tight">
                          <Link
                            href={`/blog/${slug}`}
                            className="hover:text-primary-500 text-gray-900 transition dark:text-gray-100"
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
                      <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                        {summary}
                      </div>
                    </div>
                    <div className="text-base font-medium">
                      <Link
                        href={`/blog/${slug}`}
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition"
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
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition"
            aria-label="All posts"
          >
            Every post &rarr;
          </Link>
        </div>
      )}

      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-12">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
