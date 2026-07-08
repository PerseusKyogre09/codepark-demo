export interface DefaultAvatarProps {
  name?: string
  uid?: string
  size?: 'sm' | 'md' | 'lg'
  accentColor: string
}

export default function DefaultAvatar({
  name,
  uid,
  size = 'md',
  accentColor
}: DefaultAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-24 h-24 text-2xl',
    lg: 'w-32 h-32 text-4xl'
  }

  // Generate initials from name or use first letter of uid
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (uid ? uid[0].toUpperCase() : '?')

  // Generate a consistent color based on the uid
  const getColorFromUid = (uid?: string) => {
    if (!uid) return accentColor
    const hash = uid.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0)
    }, 0)
    const hue = Math.abs(hash) % 360
    return `hsl(${hue}, 70%, 50%)`
  }

  const bgColor = getColorFromUid(uid) || accentColor

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white border-4 flex-shrink-0`}
      style={{
        borderColor: bgColor,
        backgroundColor: `${bgColor}22`,
        color: bgColor
      }}
    >
      {initials}
    </div>
  )
}
