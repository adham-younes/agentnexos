import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

// The reviewed bundle uses headings, paragraphs, lists, strong text and links.
// Render those explicitly; HTML in source is always escaped by React.
export function ContentInline({ text }: { text: string }) {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  const nodes: ReactNode[] = []; let offset = 0;
  for (const match of text.matchAll(pattern)) {
    nodes.push(text.slice(offset, match.index));
    nodes.push(match[3] ? <strong key={match.index}>{match[3]}</strong> : <Link className="underline underline-offset-4" key={match.index} href={match[2]}>{match[1]}</Link>);
    offset = match.index! + match[0].length;
  }
  nodes.push(text.slice(offset));
  return <>{nodes}</>;
}
export function ContentBody({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).filter(Boolean).map((block, index) => {
    if (block.startsWith('### ')) return <h3 className="mt-6 mb-3 text-xl" key={index}><ContentInline text={block.slice(4)} /></h3>;
    if (block.split('\n').every(line => line.startsWith('- '))) return <ul key={index}>{block.split('\n').map((line,i) => <li key={i}><p><ContentInline text={line.slice(2)} /></p></li>)}</ul>;
    return <p className="mb-5 text-sm leading-8 text-foreground/75" key={index}><ContentInline text={block} /></p>;
  })}</>;
}
export function ContentSections({ sections }: { sections: readonly { id: string; heading: string; body: string }[] }) {
  return <>{sections.map(section => <Fragment key={section.id}><section id={section.id} className="nexus-editorial-card"><h2>{section.heading}</h2><div className="nexus-editorial-copy"><ContentBody text={section.body} /></div></section></Fragment>)}</>;
}
