import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        '1E635F': '#1E635F',
        'F5FAFA': '#F5FAFA',
        'DAF2F1' : '#DAF2F1'
        },
    },
  },
  plugins: [],
} satisfies Config;
