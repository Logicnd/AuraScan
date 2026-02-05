import { ReactNode } from 'react';
import Container from './Container';

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

export default function Layout({ children, className }: LayoutProps) {
  const classes = ['py-16 md:py-20', className].filter(Boolean).join(' ');
  return <Container className={classes}>{children}</Container>;
}
