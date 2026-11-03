export async function recordDailyPageView(path, repository, now = new Date()) {
  const day = new Date(now);
  day.setUTCHours(0, 0, 0, 0);

  return repository.incrementDailyVisit({ day, path });
}
