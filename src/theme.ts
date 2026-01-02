export function setTheme(theme: "dark" | "light") {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}

export function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.documentElement.classList.add("dark");
  }
}
