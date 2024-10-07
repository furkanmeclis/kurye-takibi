'use client';
import React, {useContext, useEffect, useRef} from 'react';
import {Button} from 'primereact/button';
import {StyleClass} from 'primereact/styleclass';
import {LayoutContext} from '@/layout/context/layoutcontext';
import type {NodeRef, Page} from '@/types';
import {router} from "@inertiajs/react";
import LandingLayout from "@/Layouts/LandingLayout";
import PageContainer from "@/PageContainer";

const LandingPage: Page = ({auth, csrfToken, errors}: {
    auth?: any,
    csrfToken?: string,
    errors?: any
}) => {
    const {layoutConfig} = useContext(LayoutContext);
    const menuRef = useRef<HTMLButtonElement>(null);
    const statRef = useRef<HTMLAnchorElement>(null);
    const pricingRef = useRef<HTMLAnchorElement>(null);
    const featuresRef = useRef<HTMLAnchorElement>(null);
    const stats = useRef<HTMLDivElement | ScrollToOptions>(null);
    const features = useRef<HTMLDivElement | ScrollToOptions>(null);
    const pricing = useRef<HTMLDivElement | ScrollToOptions>(null);
    const path = '/layout/images/landing/';
    const image = 'line-effect.svg';

    const navigateToDashboard = () => {
        router.visit('/');
    };
    const navigateToRegister = () => {
        router.visit(route("auth.register.index"));
    };
    const navigateToLogin = () => {
        router.visit(route("login"));
    };

    const scrollToElement = (el: React.RefObject<HTMLDivElement>) => {
        setTimeout(() => {
            el.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }, 200);
    };

    return (
        <LandingLayout>
            <div className="surface-ground min-h-screen">
                <div className="landing-wrapper">
                    <div style={{backgroundImage: `url(${path}${image})`}}
                         className="bg-no-repeat bg-cover bg-bottom">
                        <div className="flex align-items-center justify-content-between px-5 sm:px-8 py-6">
                            <a onClick={navigateToDashboard} className="cursor-pointer">
                                    <span
                                        className="text-2xl font-bold text-color">{import.meta.env.VITE_APP_NAME}</span>
                            </a>
                            <div className="relative">
                                <StyleClass nodeRef={menuRef as NodeRef} selector="@next" enterClassName="hidden"
                                            enterActiveClassName="scalein" leaveClassName="hidden"
                                            leaveActiveClassName="fadeout" leaveToClassName="hidden"
                                            hideOnOutsideClick>
                                    <button ref={menuRef}
                                            className="cursor-pointer block lg:hidden select-none p-link w-3rem h-3rem inline-flex align-items-center justify-content-center border-circle">
                                        <i className="pi pi-bars text-4xl"></i>
                                    </button>
                                </StyleClass>
                                <div
                                    id="landing-menu"
                                    className="hidden lg:block absolute right-0 top-auto lg:static z-1 shadow-2 lg:shadow-none w-15rem lg:w-auto surface-overlay lg:surface-ground origin-top p-3 lg:p-0"
                                    style={{borderRadius: '14px'}}
                                >
                                    <ul className="flex flex-column lg:flex-row m-0 p-0 list-none text-2xl lg:text-base">
                                        <li>
                                            <StyleClass nodeRef={statRef as NodeRef} selector="#landing-menu"
                                                        leaveActiveClassName="fadeout" leaveToClassName="hidden">
                                                <a ref={statRef}
                                                   className="block p-3 cursor-pointer font-bold text-color-secondary hover:text-color transition-colors transition-duration-300"
                                                   onClick={() => scrollToElement(stats as any)}>
                                                    İstatistikler
                                                </a>
                                            </StyleClass>
                                        </li>
                                        <li>
                                            <StyleClass nodeRef={featuresRef as NodeRef} selector="#landing-menu"
                                                        leaveActiveClassName="fadeout" leaveToClassName="hidden">
                                                <a ref={featuresRef}
                                                   className="block p-3 cursor-pointer font-bold text-color-secondary hover:text-color transition-colors transition-duration-300"
                                                   onClick={() => scrollToElement(features as any)}>
                                                    Özellikler
                                                </a>
                                            </StyleClass>
                                        </li>
                                        <li>
                                            <StyleClass nodeRef={pricingRef as NodeRef} selector="#landing-menu"
                                                        leaveActiveClassName="fadeout" leaveToClassName="hidden">
                                                <a ref={pricingRef}
                                                   className="block p-3 cursor-pointer font-bold text-color-secondary hover:text-color transition-colors transition-duration-300"
                                                   onClick={() => scrollToElement(pricing as any)}>
                                                    Fiyatlandırma
                                                </a>
                                            </StyleClass>
                                        </li>
                                        <li>
                                            <a className="block p-3 cursor-pointer font-bold text-color-secondary hover:text-color transition-colors transition-duration-300"
                                               onClick={navigateToRegister}>
                                                Kayıt Ol
                                            </a>
                                        </li>
                                        <li>
                                            <a className="block p-3 cursor-pointer font-bold text-color-secondary hover:text-color transition-colors transition-duration-300"
                                               onClick={navigateToLogin}>
                                                Giriş Yap
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div
                            className="flex flex-column lg:flex-row gap-5 align-items-center justify-content-between px-5 sm:px-8 py-8 overflow-hidden">
                            <div className="flex-1 fadein animation-duration-1000">
                                <h1 className="font-bold text-7xl mt-0 mb-5">{import.meta.env.VITE_APP_NAME}</h1>
                                <p className="text-3xl mb-5 line-height-3">
                                    Kuryeler İle Restoranlar Arasında En Sağlam Köprü
                                </p>
                                <Button label="Kayıt Olun" className={"mr-3"} onClick={navigateToRegister}></Button>
                                <Button label="Giriş Yap" onClick={navigateToLogin}></Button>
                            </div>
                            <div className="flex-1">
                                <img alt="intro image"
                                     src="https://www.erler-as.com.tr/Upload/moto-kurye-bg-1024x768.png"
                                     className="fadeinright animation-ease-in-out animation-duration-1000 w-full border-round-2xl shadow-2"/>
                            </div>
                        </div>
                        <div ref={stats as any} className="p-8">
                            <div className="flex flex-column align-items-center mb-7">
                                <span className="font-bold text-color-secondary text-2xl mb-3">Ecosystem</span>
                                <h2 className="font-bold text-6xl my-0">All You Need Is Here</h2>
                            </div>
                            <div className="flex flex-column xl:flex-row justify-content-center gap-5">
                                <div className="surface-card text-center py-7 px-5 shadow-2"
                                     style={{borderRadius: '14px'}}>
                                    <div className="text-xl text-color-secondary mb-3">Easy to use</div>
                                    <h3 className="mt-0 mb-3 font-bold text-4xl">Play like a toy</h3>
                                    <p className="line-height-3 mb-5 text-color-secondary">
                                        More than <strong>80</strong> UI components.
                                    </p>
                                    <Button icon="pi pi-arrow-right" label="Get Started" className="p-button-text"
                                            iconPos="right"></Button>
                                    <div className="mt-8 xl:pt-8">
                                        <img alt="intro image" src="/layout/images/landing/feature-components.svg"
                                             className="w-9 md:w-4 xl:w-9"/>
                                    </div>
                                </div>
                                <div className="flex flex-column md:flex-row xl:flex-column gap-5">
                                    <div
                                        className="flex-1 surface-card flex flex-column xl:flex-row xl:align-items-center justify-content-between py-7 px-5 shadow-2 gap-5"
                                        style={{borderRadius: '14px'}}>
                                        <div
                                            className="flex-1 flex-order-1 xl:flex-order-0 text-center xl:text-left">
                                            <img alt="intro image" src="/layout/images/landing/feature-blocks.svg"
                                                 className="w-9"/>
                                        </div>
                                        <div className="text-center xl:text-right flex-1">
                                            <div className="text-xl text-color-secondary mb-3">PrimeBlocks</div>
                                            <h3 className="mt-0 mb-3 font-bold text-4xl">Save your time</h3>
                                            <p className="line-height-3 mb-5 text-color-secondary">
                                                PrimeBlocks have <strong>370+</strong> blocks: hero sections,
                                                pricing,
                                                footers and more....
                                            </p>
                                            <Button icon="pi pi-arrow-right" label="Browse Blocks"
                                                    className="p-button-text" iconPos="right"></Button>
                                        </div>
                                    </div>
                                    <div
                                        className="flex-1 surface-card flex flex-column xl:flex-row xl:align-items-center justify-content-between py-7 px-5 shadow-2 gap-5"
                                        style={{borderRadius: '14px'}}>
                                        <div className="text-center xl:text-left flex-1">
                                            <div className="text-xl text-color-secondary mb-3">PrimeIcons</div>
                                            <h3 className="mt-0 mb-3 font-bold text-4xl">Enjoy 300+ Icons</h3>
                                            <p className="line-height-3 mb-5 text-color-secondary">What you need in
                                                your
                                                app, you find any icon in PrimeIcons.</p>
                                            <Button icon="pi pi-arrow-right" label="Explore Icons"
                                                    className="p-button-text" iconPos="right"></Button>
                                        </div>
                                        <div className="flex-1 text-center xl:text-right">
                                            <img alt="intro image" src="/layout/images/landing/feature-icons.svg"
                                                 className="w-9"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="surface-card text-center py-7 px-5 shadow-2"
                                     style={{borderRadius: '14px'}}>
                                    <div className="text-xl text-color-secondary mb-3">Theme Designer</div>
                                    <h3 className="mt-0 mb-3 font-bold text-4xl">Design Your Own</h3>
                                    <p className="line-height-3 mb-5 text-color-secondary">Limitless
                                        customization.</p>
                                    <Button icon="pi pi-arrow-right" label="View Designer" className="p-button-text"
                                            iconPos="right"></Button>
                                    <div className="mt-8 xl:pt-8">
                                        <img alt="intro image" src="/layout/images/landing/feature-designer.svg"
                                             className="w-9 md:w-4 xl:w-9"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ref={features as any} className="px-5 sm:px-8 py-8 surface-card">
                        <div className="flex flex-column lg:flex-row justify-content-center gap-5">
                            <div className={"flex-1"}>
                                <div
                                    className="bg-orange-50 p-6 flex align-items-center justify-content-center mb-5"
                                    style={{borderRadius: '14px', borderTopLeftRadius: '5rem'}}>
                                    <img alt="intro image" src="/layout/images/landing/icon-modern-responsive.svg"
                                         className="h-6rem sm:h-12rem"/>
                                </div>
                                <h3 className="mt-0 mb-5 font-bold text-4xl">Mobil Uyumlu Tasarım</h3>
                                <p className="line-height-3 text-color-secondary">
                                    Sektörde mobil uyumlu tasarım.
                                </p>
                            </div>
                            <div className={"flex-1"}>
                                <div className="bg-green-50 p-6 flex align-items-center justify-content-center mb-5"
                                     style={{borderRadius: '14px'}}>
                                    <img alt="intro image" src="/layout/images/landing/icon-modern-design.svg"
                                         className="h-6rem sm:h-12rem"/>
                                </div>
                                <h3 className="mt-0 mb-5 font-bold text-4xl">Modern Tasarım</h3>
                                <p className="line-height-3 text-color-secondary">
                                    Kullanıcı dostu arayüz.
                                </p>
                            </div>
                            <div className={"flex-1"}>
                                <div className="bg-red-50 p-6 flex align-items-center justify-content-center mb-5"
                                     style={{borderRadius: '14px', borderBottomRightRadius: '5rem'}}>
                                    <img alt="intro image" src="/layout/images/landing/feature-icons.svg"
                                         className="h-6rem sm:h-12rem"/>
                                </div>
                                <h3 className="mt-0 mb-5 font-bold text-4xl">Clean Code</h3>
                                <p className="line-height-3 text-color-secondary">Nam non ligula sed urna malesuada
                                    lacinia. Aliquam sed viverra ipsum.</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="px-5 sm:px-8 py-8 surface-ground flex flex-wrap gap-5 align-items-center justify-content-between">
                        <div className="text-4xl font-bold">Join the Prime Community</div>
                        <Button label="Join Now" className="p-button-raised"></Button>
                    </div>
                    <div ref={pricing as any}
                         className="px-5 sm:px-8 py-8 surface-card flex flex-column lg:flex-row justify-content-center gap-5">
                        <div className="shadow-2 surface-card p-5 text-center border-round-2xl">
                            <img alt="intro image" src="/layout/images/landing/asset-free.svg"
                                 className="w-full sm:w-6 lg:w-full block mx-auto mb-5"/>
                            <div className="text-2xl font-bold mb-3">Free</div>
                            <div className="mb-5">
                                <i className="pi pi-spin pi-spinner"></i>
                            </div>
                            <ul className="list-none p-0 m-0">
                                <li className="flex align-items-center">
                                    <i className="pi pi-check-circle text-green-500 text-xl mr-2"></i>
                                    <span>Responsive Layout</span>
                                </li>
                            </ul>
                        </div>
                        <div className="shadow-2 surface-card p-5 text-center border-round-2xl">
                            <img alt="intro image" src="/layout/images/landing/asset-premium.svg"
                                 className="w-full sm:w-6 lg:w-full block mx-auto mb-5"/>
                            <div className="text-2xl font-bold mb-3">Premium</div>
                            <div className="mb-5">
                                <i className="pi pi-spin pi-spinner"></i>
                            </div>
                            <ul className="list-none p-0 m-0">
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 text-xl mr-2"></i>
                                    <span>Responsive Layout</span>
                                </li>
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 text-xl mr-2"></i>
                                    <span>10000 Push Messages</span>
                                </li>
                                <li className="flex align-items-center">
                                    <i className="pi pi-check-circle text-green-500 text-xl mr-2"></i>
                                    <span>50 Support Tickets</span>
                                </li>
                            </ul>
                        </div>
                        <div className="shadow-2 surface-card p-5 text-center border-round-2xl">
                            <img alt="intro image" src="/layout/images/landing/asset-enterprise.svg"
                                 className="w-full sm:w-6 lg:w-full block mx-auto mb-5"/>
                            <div className="text-2xl font-bold mb-3">Enterprise</div>
                            <div className="mb-5">
                                <i className="pi pi-spin pi-spinner"></i>
                            </div>
                            <ul className="list-none p-0 m-0">
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 text-xl mr-2"></i>
                                    <span>Responsive Layout</span>
                                </li>
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 text-xl mr-2"></i>
                                    <span>Unlimited Push Messages</span>
                                </li>
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 text-xl mr-2"></i>
                                    <span>1000 Support Tickets</span>
                                </li>
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 text-xl mr-2"></i>
                                    <span>Free Shipping</span>
                                </li>
                                <li className="flex align-items-center">
                                    <i className="pi pi-check-circle text-green-500 text-xl mr-2"></i>
                                    <span>Unlimited Storage</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div
                        className="px-5 sm:px-8 py-8 bg-gray-900 flex flex-column md:flex-row md:align-items-start gap-5"
                        style={{borderTopLeftRadius: '14px', borderTopRightRadius: '14px'}}>
                        <div className="flex align-items-center flex-1">
                            <img alt="intro image" src="/layout/images/landing/logo-v.svg" className="w-4rem"/>
                            <span className="text-white text-5xl font-bold ml-2">Verona</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-xl text-gray-600 mb-4">LATEST</div>
                            <ul className="list-none p-0 m-0">
                                <li className="mb-3">
                                    <a className="cursor-pointer text-white text-xl">Ultima</a>
                                </li>
                                <li className="mb-3">
                                    <a className="cursor-pointer text-white text-xl">Apollo</a>
                                </li>
                                <li className="mb-3">
                                    <a className="cursor-pointer text-white text-xl">Sakai</a>
                                </li>
                                <li className="mb-3">
                                    <a className="cursor-pointer text-white text-xl">Diamond</a>
                                </li>
                                <li>
                                    <a className="cursor-pointer text-white text-xl">Poseidon</a>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1">
                            <div className="text-xl text-gray-600 mb-4">DEMOS</div>
                            <ul className="list-none p-0 m-0">
                                <li className="mb-3">
                                    <a href="https://www.primefaces.org/primeng"
                                       className="cursor-pointer text-white text-xl">
                                        PrimeNG
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a href="https://www.primefaces.org/showcase"
                                       className="cursor-pointer text-white text-xl">
                                        PrimeFaces
                                    </a>
                                </li>
                                <li className="mb-3">
                                    <a href="https://www.primefaces.org/primereact"
                                       className="cursor-pointer text-white text-xl">
                                        PrimeReact
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.primefaces.org/primevue"
                                       className="cursor-pointer text-white text-xl">
                                        PrimeVue
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-1 gap-4">
                            <a href="http://github.com/primefaces">
                                <i className="pi pi-github text-white text-5xl"></i>
                            </a>
                            <a href="https://discord.gg/gzKFYnpmCY">
                                <i className="pi pi-discord text-white text-5xl"></i>
                            </a>
                            <a href="http://twitter/primeng">
                                <i className="pi pi-twitter text-white text-5xl"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </LandingLayout>
    );
};

export default LandingPage;
