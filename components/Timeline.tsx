const Timeline = ({ items }) => (
  <div className="relative border-l border-gray-200 dark:border-gray-700">
    {items.map((item, idx) => (
      <div key={idx} className="mb-8 ml-4">
        <div className="absolute -left-1.5 w-3 h-3 bg-primary-500 rounded-full border border-white dark:border-gray-900" />
        <h3 className="text-xl font-semibold">{item.title || item.degree || item.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {item.company || item.institution || item.issuer} • {item.year}
        </p>
        {item.description &&
          item.description.map((d, i) => (
            <p key={i} className="mt-2 text-gray-600 dark:text-gray-300">
              {d}
            </p>
          ))}
        {item.details &&
          item.details.map((d, i) => (
            <p key={i} className="mt-2 text-gray-600 dark:text-gray-300">
              {d}
            </p>
          ))}
      </div>
    ))}
  </div>
)

export default Timeline
