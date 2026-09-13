"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "cn";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({
  data,
  className,
}: {
  data: TimelineEntry[];
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className={cn("w-full bg-transparent font-sans", className)}
      ref={containerRef}
    >
      <div ref={ref} className="relative mx-auto pb-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-6 md:gap-8"
          >
            <div className="sticky top-6 z-40 flex max-w-[9rem] flex-col items-center self-start md:w-36 md:flex-row">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-slate-200">
                <div className="h-4 w-4 rounded-full border border-emerald-200 bg-emerald-500 p-2" />
              </div>
              <h3 className="hidden pl-16 text-base font-black text-slate-400 md:block">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pl-16 md:pl-4">
              <h3 className="mb-3 block text-xl font-black text-slate-400 md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-slate-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-emerald-500 via-cyan-500 to-transparent from-[0%] via-[10%]"
          />
        </div>
      </div>
    </div>
  );
};
