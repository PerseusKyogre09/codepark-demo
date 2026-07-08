import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onAnimationComplete?: () => void;
  triggerOnScroll?: boolean;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 50,
  duration = 0.8,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 50, rotateX: -90 },
  to = { opacity: 1, y: 0, rotateX: 0 },
  threshold = 0.8,
  rootMargin = '0px',
  tag = 'h1',
  textAlign = 'center',
  onAnimationComplete,
  triggerOnScroll = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<string[]>([]);

  useEffect(() => {
    // Split text based on type
    let splitElements: string[] = [];

    if (splitType === 'chars') {
      splitElements = text.split('');
    } else if (splitType === 'words') {
      splitElements = text.split(' ');
    } else {
      splitElements = text.split('\n');
    }

    setElements(splitElements);
  }, [text, splitType]);

  useGSAP(
    () => {
      if (!containerRef.current || elements.length === 0) return;

      const items = containerRef.current.querySelectorAll('.split-item');
      if (items.length === 0) return;

      const animationConfig = {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        onComplete: onAnimationComplete
      };

      if (triggerOnScroll) {
        const startPct = (1 - threshold) * 100;
        const start = `top ${startPct}%${rootMargin ? ` ${rootMargin}` : ''}`;

        gsap.fromTo(
          items,
          from,
          {
            ...animationConfig,
            scrollTrigger: {
              trigger: containerRef.current,
              start,
              once: true
            }
          }
        );

        return () => {
          ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === containerRef.current) st.kill();
          });
        };
      } else {
        gsap.fromTo(items, from, animationConfig);
      }
    },
    {
      dependencies: [elements, delay, duration, ease, JSON.stringify(from), JSON.stringify(to), threshold, rootMargin, triggerOnScroll],
      scope: containerRef
    }
  );

  const renderContent = () => {
    return elements.map((item, index) => (
      <span
        key={index}
        className="split-item inline-block"
        style={{
          willChange: 'transform, opacity',
          perspective: '1000px'
        }}
      >
        {item === ' ' ? '\u00A0' : item}
      </span>
    ));
  };

  const style: React.CSSProperties = {
    textAlign,
    display: 'block'
  };

  const Tag = tag;

  return (
    <div ref={containerRef} className={className}>
      <Tag style={style}>
        {renderContent()}
      </Tag>
    </div>
  );
};

export default SplitText;
