import type { BookingStats, TimeRange } from "@/shared/types/dashboard";

export function fillMissingChartData(rawData: BookingStats[], timeRange: TimeRange): BookingStats[] {

  // if (!rawData.length) return [];

  const filled: BookingStats[] = [];
  const now = new Date();

  if (timeRange === "yearly") {
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(now.getFullYear(), month, 1);
      const existing = rawData.find((d) => {
        const date = new Date(d.date);
        return (
          date.getMonth() === month && date.getFullYear() === now.getFullYear()
        );
      });
      filled.push(
        existing || {
          date: monthDate.toISOString().slice(0, 10),
          bookingCount: 0,
          bookingRevenue: 0,
        }
      );
    }
  }

  if (timeRange === "monthly") {
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const existing = rawData.find((d) => {
        const dt = new Date(d.date);
        return (
          dt.getDate() === day &&
					dt.getMonth() === month &&
					dt.getFullYear() === year
        );
      });
      filled.push(
        existing || {
          date: date.toISOString().slice(0, 10),
          bookingCount: 0,
          bookingRevenue: 0,
        }
      );
    }
  }

  if (timeRange === "weekly") {
    const currentDay = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((currentDay + 6) % 7));

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      const existing = rawData.find((d) => {
        const dt = new Date(d.date);
        return dt.toDateString() === date.toDateString();
      });

      filled.push(
        existing || {
          date: date.toISOString().slice(0, 10),
          bookingCount: 0,
          bookingRevenue: 0,
        }
      );
    }
  }

  if (timeRange === "daily") {
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(now);
      date.setHours(hour, 0, 0, 0);

      const existing = rawData.find((d) => {
        const dt = new Date(d.date);
        return (
          dt.getHours() === hour &&
					dt.toDateString() === now.toDateString()
        );
      });

      filled.push(
        existing || {
          date: date.toISOString(),
          bookingCount: 0,
          bookingRevenue: 0,
        }
      );
    }
  }

  return filled;
}