export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Неверная дата";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-EN", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);

  return `${day} ${month} '${year}`;
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Неверное время";
  }

  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatDateTime = (dateString: string): string => {
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
};
