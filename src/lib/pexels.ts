/**
 * Pexels stock photos used on the landing page and auth screens.
 * Swap an image by changing its id here (the id is the number at the end of the
 * photo's pexels.com URL). Pexels photos are free to use without attribution.
 */
export function pexelsUrl(id: number): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb`;
}

export const PEXELS = {
  /** Students studying together in a library — Tima Miroshnichenko */
  studyGroup: {
    src: pexelsUrl(9572700),
    alt: "Three students studying together at a library table with books and laptops",
  },
  /** Students at a library table — cottonbro studio */
  login: {
    src: pexelsUrl(6344238),
    alt: "Students studying together in a library",
  },
  /** Group collaborating on a study project — Andy Barbour */
  signUp: {
    src: pexelsUrl(6684535),
    alt: "A group of students collaborating on a study project in a modern library",
  },
} as const;
