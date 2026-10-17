'use client';

import { useEffect, useRef, useState } from 'react';
import { Command, Menu, X } from 'lucide-react';
import { LocaleSwitcher } from '@/components/site/locale-switcher';
import { publicPath } from '@/lib/i18n/routing';
import { useLocale, useT } from '@/lib/i18n/use-t';
import { publicCopy } from '@/lib/content/public-copy';

const navLinks = [
    { ar: 'المنصة', name: 'Platform', href: '/platform' },
    { ar: 'الحلول', name: 'Solutions', href: '/solutions' },
    { ar: 'القطاعات', name: 'Industries', href: '/industries' },
    { ar: 'الخدمات', name: 'Services', href: '/services' },
    { ar: 'الموارد', name: 'Resources', href: '/resources' },
    { ar: 'من نحن', name: 'About', href: '/about' },
];

export function Navigation() {
    const t = useT();
    const locale = useLocale();
    const copy = publicCopy[locale];
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const toggle = toggleRef.current;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const background = [...document.querySelectorAll<HTMLElement>('#main-content, #site-footer')].map(element => ({ element, inert: element.inert }));
        background.forEach(({ element }) => { element.inert = true; });
        const focusFrame = requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>('a[href]')?.focus());
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsMobileMenuOpen(false);
            if (event.key === 'Tab') {
                const controls = [...(headerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])].filter(element => element.tabIndex >= 0 && element.offsetParent !== null && !element.closest('[inert]'));
                const first = controls[0];
                const last = controls.at(-1);
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }
        };
        const closeOnDesktop = () => { if (window.innerWidth >= 1280) setIsMobileMenuOpen(false); };
        window.addEventListener('keydown', closeOnEscape);
        window.addEventListener('resize', closeOnDesktop);
        return () => {
            cancelAnimationFrame(focusFrame);
            document.body.style.overflow = previousOverflow;
            background.forEach(({ element, inert }) => { element.inert = inert; });
            window.removeEventListener('keydown', closeOnEscape);
            window.removeEventListener('resize', closeOnDesktop);
            if (toggle?.isConnected) toggle.focus();
        };
    }, [isMobileMenuOpen]);

    return <header ref={headerRef} className={`nexus-nav premium-nav${isScrolled ? ' is-scrolled' : ''}${isMobileMenuOpen ? ' is-menu-open' : ''}`}>
        <nav className="nexus-nav-inner" aria-label={t('nav.primary', 'Primary navigation')}>
            <div className="premium-nav-layout">
                <a href={publicPath('/')} tabIndex={isMobileMenuOpen ? -1 : undefined} className="premium-brand" aria-label={locale === 'ar' ? 'AGYNEXA — الرئيسية' : 'AGYNEXA — Home'}>
                    <span className="premium-wordmark">AGYNEXA</span><Command className="premium-brand-icon" size={32} strokeWidth={1.5} aria-hidden="true" />
                </a>
                <div className="premium-desktop-links">
                    {navLinks.map(link => <a key={link.href} href={publicPath(link.href)}>{locale === 'ar' ? link.ar : link.name}</a>)}
                </div>
                <div className="premium-desktop-actions"><a href={publicPath('/login')}>{copy.signIn}</a><LocaleSwitcher inverted /></div>
                <div className="premium-mobile-actions">
                    <div className="premium-mobile-account" inert={isMobileMenuOpen} aria-hidden={isMobileMenuOpen || undefined}>
                        <a href={publicPath('/login')} className="premium-mobile-sign-in">{copy.signIn}</a><LocaleSwitcher inverted compact />
                    </div>
                    <button id="mobile-menu-toggle" ref={toggleRef} type="button" className="premium-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={t('nav.toggleMenu', 'Toggle menu')} aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation">
                        {isMobileMenuOpen ? <X size={25} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={25} strokeWidth={1.5} aria-hidden="true" />}
                    </button>
                </div>
            </div>
        </nav>
        <div ref={menuRef} id="mobile-navigation" role="dialog" aria-label={t('nav.primary', 'Primary navigation')} aria-modal={isMobileMenuOpen || undefined} aria-owns={isMobileMenuOpen ? 'mobile-menu-toggle' : undefined} inert={!isMobileMenuOpen} aria-hidden={!isMobileMenuOpen} className={`premium-mobile-menu${isMobileMenuOpen ? ' is-open' : ''}`}>
            <div className="premium-menu-inner">
                <div className="premium-menu-links">{navLinks.map(link => <a key={link.href} href={publicPath(link.href)} onClick={() => setIsMobileMenuOpen(false)}>{locale === 'ar' ? link.ar : link.name}</a>)}</div>
                <div className="premium-menu-bottom">
                    <LocaleSwitcher inverted />
                    <div className="premium-menu-actions"><a href={publicPath('/login')} className="upgrade-button secondary" onClick={() => setIsMobileMenuOpen(false)}>{copy.signIn}</a><a href={publicPath('/start')} className="upgrade-button" onClick={() => setIsMobileMenuOpen(false)}>{copy.discussProject}</a></div>
                </div>
            </div>
        </div>
    </header>;
}
