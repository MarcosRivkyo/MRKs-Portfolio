'use client'

import { motion } from 'framer-motion'
import { loadFull } from 'tsparticles'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  const particlesInit = async (main: any) => {
    await loadFull(main)
  }

  return (
    <>
      {/* Hero animado con fondo tipo Matrix */}
<section className="relative min-h-screen w-full overflow-hidden bg-transparent">

  {/* Contenido de presentación */}
  <motion.div
    className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    <motion.img
      src="/static/images/avatar.png"
      alt="My Avatar"
      className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-6 border-4 border-green-500 shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 1 }}
    />

    <motion.h1
      className="text-5xl md:text-6xl font-extrabold text-green-400 mb-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 1 }}
    >
      Welcome to my portfolio
    </motion.h1>

    <motion.p
      className="text-lg md:text-xl text-green-700 mb-2" // Ajustado para modo claro
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 1.2 }}
    >
      Here you can explore my projects, skills, and professional journey.
    </motion.p>
    <motion.p
      className="text-lg md:text-xl text-green-700" // Ajustado para modo claro
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9, duration: 1.2 }}
    >
      Feel free to browse through my work and learn more about my expertise in web development and design.
    </motion.p>
  </motion.div>
</section>


      {/* Lista de posts con animación */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700 mt-20">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100 text-center">
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
                    <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                    </dd>
                  </dl>
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl leading-8 font-bold tracking-tight">
                          <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100 hover:text-primary-500 transition">
                            {title}
                          </Link>
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag) => <Tag key={tag} text={tag} />)}
                        </div>
                      </div>
                      <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                        {summary}
                      </div>
                    </div>
                    <div className="text-base leading-6 font-medium">
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
        <div className="flex justify-end text-base leading-6 font-medium mt-6">
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
