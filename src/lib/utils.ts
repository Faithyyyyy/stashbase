import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function buildReminderAt(
  reminderDate: string,
  reminderTime: string,
): string | undefined {
  if (!reminderDate) return undefined;
  const [day, month, year] = reminderDate.split("/");
  const timeMatch = reminderTime.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
  if (!timeMatch) return undefined;
  let hours = parseInt(timeMatch[1]);
  const minutes = timeMatch[2];
  const meridiem = timeMatch[3];
  if (meridiem === "pm" && hours !== 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;
  const fullYear =
    parseInt(year) < 100 ? 2000 + parseInt(year) : parseInt(year);
  return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${String(hours).padStart(2, "0")}:${minutes}:00.000Z`;
}
