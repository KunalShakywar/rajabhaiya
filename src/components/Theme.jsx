import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const root = document.documentElement;

        if (dark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    return (
        <button
            onClick={() => setDark(!dark)}
            className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
            {dark ? "Light" : "Dark"}
        </button>
    );
}