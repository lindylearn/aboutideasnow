/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    plugins: [],
    theme: {
        extend: {
            colors: {
                background: "rgb(241 245 249)",
                text: "#333333"
            },
            fontFamily: {
                text: ["Karla", "sans-serif"],
                title: ["Young Serif", "serif"]
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
