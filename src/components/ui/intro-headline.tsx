import { Fragment, type CSSProperties } from "react";

type Segment = { text: string; accent?: boolean };

/** Splits a headline into masked words that rise in sequence (see .intro-word in globals.css). */
export function IntroHeadline({ segments }: { segments: Segment[] }) {
  let index = 0;
  return (
    <>
      {segments.map((segment, s) =>
        segment.text.split(" ").map((word, w) => {
          const style = { "--i": index++ } as CSSProperties;
          return (
            <Fragment key={`${s}-${w}`}>
              <span className="intro-word">
                {segment.accent ? (
                  <em style={style} className="text-gold-gradient animate-shimmer pr-[0.08em] font-normal italic">
                    {word}
                  </em>
                ) : (
                  <span style={style}>{word}</span>
                )}
              </span>{" "}
            </Fragment>
          );
        }),
      )}
    </>
  );
}
