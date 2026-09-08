const variants = {
  horizontal: { file: 'project-os-horizontal.webp', width: 800, height: 267 },
  stacked: { file: 'project-os-stacked.webp', width: 800, height: 600 },
  inverse: { file: 'project-os-stacked-inverse.webp', width: 480, height: 360 },
} as const

export default function ProjectOsLogo({
  variant = 'horizontal',
  className,
}: {
  variant?: keyof typeof variants
  className?: string
}) {
  const image = variants[variant]
  return (
    <img
      src={`/images/brand/${image.file}`}
      alt="Project OS — estimate, schedule, deliver"
      width={image.width}
      height={image.height}
      className={className}
      decoding="async"
    />
  )
}
