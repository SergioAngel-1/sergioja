import { useEffect, useRef, useState } from 'react';

interface UseTypingAnimationOptions {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDelay?: number;
}

/**
 * Hook for typewriter animation cycling through an array of words.
 * Returns the current visible text.
 */
export function useTypingAnimation({
  words,
  typeSpeed = 120,
  deleteSpeed = 120,
  pauseDelay = 800,
}: UseTypingAnimationOptions): string {
  const [typedText, setTypedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const prevWordsRef = useRef(words);

  useEffect(() => {
    // Detect words change (e.g. language switch) — reset inline to avoid double re-render
    if (prevWordsRef.current !== words) {
      prevWordsRef.current = words;
      setCurrentWordIndex(0);
      setTypedText('');
      return;
    }

    const word = words[currentWordIndex] || '';
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      if (!isDeleting) {
        charIndex++;
        setTypedText(word.substring(0, charIndex));
        if (charIndex === word.length) {
          isDeleting = true;
          timeoutId = setTimeout(tick, pauseDelay);
        } else {
          timeoutId = setTimeout(tick, typeSpeed);
        }
      } else {
        charIndex--;
        setTypedText(word.substring(0, charIndex));
        if (charIndex <= 0) {
          isDeleting = false;
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        } else {
          timeoutId = setTimeout(tick, deleteSpeed);
        }
      }
    };

    timeoutId = setTimeout(tick, typeSpeed);
    return () => clearTimeout(timeoutId);
  }, [currentWordIndex, words, typeSpeed, deleteSpeed, pauseDelay]);

  return typedText;
}
