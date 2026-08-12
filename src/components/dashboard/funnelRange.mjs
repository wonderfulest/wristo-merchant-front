const toLocalDate = (value) => {
  if (value instanceof Date) return new Date(value)
  const [year, month, day] = String(value).split(' ')[0].split('-').map(Number)
  return new Date(year, month - 1, day)
}

const formatLocalDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatLocalTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export const buildSelectedDayRange = (startValue, endValue) => {
  const start = toLocalDate(startValue)
  const endInclusive = toLocalDate(endValue)
  const endExclusive = new Date(endInclusive)
  endExclusive.setDate(endExclusive.getDate() + 1)
  const startDate = formatLocalDate(start)
  const endDate = formatLocalDate(endInclusive)
  return {
    startDate,
    endDate,
    displayPeriod: `[${startDate} 00:00, ${formatLocalDate(endExclusive)} 00:00)`,
  }
}

export const buildCompletedDayRange = (days, now = new Date()) => {
  const endExclusive = new Date(now)
  endExclusive.setHours(0, 0, 0, 0)
  const start = new Date(endExclusive)
  start.setDate(start.getDate() - days)
  const endInclusive = new Date(endExclusive)
  endInclusive.setDate(endInclusive.getDate() - 1)
  return buildSelectedDayRange(start, endInclusive)
}

export const buildCurrentDayRange = (now = new Date()) => {
  const current = new Date(now)
  const currentDate = formatLocalDate(current)
  return {
    startDate: currentDate,
    endDate: currentDate,
    displayPeriod: `[${currentDate} 00:00, ${currentDate} ${formatLocalTime(current)}]`,
  }
}

export const buildCompletedDayRangeAtOffset = (daysAgo, now = new Date()) => {
  const day = new Date(now)
  day.setHours(0, 0, 0, 0)
  day.setDate(day.getDate() - daysAgo)
  return buildSelectedDayRange(day, day)
}
