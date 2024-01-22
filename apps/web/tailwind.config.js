/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    plugins: [],
    theme: {
        extend: {
            colors: {
                background: "#ededed",
                light: "white",
                bold: "#ffb200",
                text: "#351e30"
            },
            fontFamily: {
                title: ["", "serif"],
                text: ["", "sans-serif"],
                mono: ["PT Mono", "monospace"]
            },
            keyframes: {
                fadein: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" }
                },
                fadeout: {
                    "0%": { opacity: "1" },
                    "100%": { opacity: "0" }
                }
            },
            animation: {
                fadein: "fadein 200ms ease-out backwards",
                fadeout: "fadeout 200ms ease-in forwards"
            }
        }
    }
};
