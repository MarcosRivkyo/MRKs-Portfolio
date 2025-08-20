import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <>
      <section className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-4 pt-6 pb-8 text-center md:space-y-5">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-6xl dark:text-gray-100">
            Projects
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-7 text-gray-500 dark:text-gray-400">
            A selection of my academic, professional, and personal projects — from AI research to
            game development. Each project reflects my passion for solving problems and building
            innovative solutions.
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap justify-center">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
