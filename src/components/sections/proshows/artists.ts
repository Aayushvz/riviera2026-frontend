import { Description } from "@radix-ui/react-dialog"
import { describe } from "node:test"

const artistsData = [
  {
    day: "Day One",
    image: "/proshows/day-one-1.png",
    artistName: "Sunidhi Chauhan",
    date: "26th Feb",
    description:
      "A powerhouse performer known for her electrifying vocals, iconic hits, and unmatched stage energy.",
    color: "#FAA835",
    hidden: false,
  },
  // {
  //   day: "Day One",
  //   image: "/proshows/day-one-1.png",
  //   artistName: "Sunidhi Chauhan",
  //   date: "26th Feb",
  //   description:
  //     "A powerhouse performer known for her electrifying vocals, iconic hits, and unmatched stage energy.",
  //   color: "#FAA835",
  //   hidden: true,
  // },
  {
    day: "Day Two",
    image: "/proshows/day-two-1.png",
    artistName: "Thaman",
    date: "27th Feb",
    description:
      "An energetic performer known for powerful stage presence and chart-topping hits across genres.",
    color: "#5E76A5",
  },
  // {
  //   day: "Day Two",
  //   image: "/proshows/day-two-1.png",
  //   artistName: "Thaman",
  //   date: "27th Feb",
  //   description:
  //     "A powerhouse performer known for her electrifying vocals, iconic hits, and unmatched stage energy.",
  //   color: "#FAA835",
  //   hidden: true,
  // },
  {
    day: "Day Three",
    image: "/proshows/day-three-1.png",
    artistName: "Benny Dayal",
    date: "28th Feb",
    description:
      "A vibrant performer celebrated for his infectious energy and chart-topping hits across languages and genres.",
    color: "#41CAE3",
  },
  {
    day: "Day Three",
    image: "/proshows/day-three-2.png",
    artistName: "Pradeep Kumar",
    date: "28th Feb",
    description:
      "A soulful vocalist celebrated for emotional depth and timeless melodies across languages.",
    color: "#D94339",
  },
  {
    day: "Day Four",
    image: "/proshows/shaan.png",
    artistName: "Shaan (DJ)",
    date: "1st March",
    description:
      "Electronic DJ known for high-energy sets, Bollywood remixes, global beats, and unforgettable festival experiences that ignite dance floors everywhere worldwide.",
    color: "#C9C8C8",
    hidden: false,
  },
  {
    day: "Day Four",
    image: "/proshows/day-four-2.png",
    artistName: "Ritviz",
    date: "1st March",
    description:
      "Explosive drops, electric energy, and a night so intense it stays with you long after the lights fade.",
    color: "#7B9ACC",
    hidden: false,
  },
]

export default artistsData
