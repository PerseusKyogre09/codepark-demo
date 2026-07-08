import { useEffect, useState } from 'react';

interface TypingAnimationProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  speed?: number; // milliseconds per character
  cursorColor?: string;
  onComplete?: () => void;
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  className = '',
  style = {},
  speed = 50,
  cursorColor = '#3fff8b',
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    } else if (displayedText.length === text.length && isTyping) {
      setIsTyping(false);
      onComplete?.();
    }
  }, [displayedText, text, speed, isTyping, onComplete]);

  return (
    <span className={className} style={style}>
      {displayedText}
      {isTyping && (
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            marginLeft: '2px',
            backgroundColor: cursorColor,
            animation: 'blink 1s infinite',
          }}
        />
      )}
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};

export default TypingAnimation;
