/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    plugins: [],
    theme: {
        extend: {
            colors: {
                background: "#fafafa",
                light: "rgba(255, 255, 255, 0.32)",
                border: "rgba(33, 35, 36, 0.04)",
                bold: "rgb(213, 199, 162)",
                text: "#2c2c2c"
            },
            fontFamily: {
                title: ["Reckless", "serif"],
                text: ["DM Sans", "sans-serif"],
                mono: ["PT Mono", "monospace"]
            },
            keyframes: {
                fadein: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" }
                },
                cardFadein: {
                    "0%": { opacity: "0", transform: "translateY(5px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" }
                }
            },
            animation: {
                fadein: "fadein 200ms ease-out backwards",
                cardFadein: "cardFadein 600ms cubic-bezier(0.16, 1, 0.3, 1) backwards"
            }
        }
    }
};
