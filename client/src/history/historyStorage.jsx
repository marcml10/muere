const STORAGE_KEY = "muer-history";

export const loadHistory = () => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return {};
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load Muer history:", error);
    return {};
  }
};

export const saveHistory = (history) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save Muer history:", error);
  }
};