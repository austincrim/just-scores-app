import { addDays, format } from "date-fns"

export type DayOption = {
  id: string
  label: string
  date: string
}

export function generateDays(daysBack = 3, daysForward = 7): DayOption[] {
  const today = new Date()
  const days: DayOption[] = []

  for (let i = -daysBack; i <= daysForward; i++) {
    const date = addDays(today, i)
    const dateStr = format(date, "yyyy-MM-dd")

    const label =
      i === 0
        ? "Today"
        : i === -1
          ? "Yesterday"
          : i === 1
            ? "Tomorrow"
            : format(date, "EEE, MMM d")

    days.push({ id: dateStr, label, date: dateStr })
  }

  return days
}

export function getTodayId(): string {
  return format(new Date(), "yyyy-MM-dd")
}
