'use client';
import React, {useContext, useEffect, useState} from 'react';
import {Button} from 'primereact/button';
import {Chart} from 'primereact/chart';
import {Dropdown, DropdownChangeEvent} from 'primereact/dropdown';
import {Avatar} from 'primereact/avatar';
import {AvatarGroup} from 'primereact/avatargroup';
import {ChartData, ChartOptions} from 'chart.js';
import {ProductService} from '@/demo/service/ProductService';
import {LayoutContext} from '@/layout/context/layoutcontext';
import {TabView, TabPanel} from 'primereact/tabview';
import {Tag} from 'primereact/tag';
import {Demo} from '@/types/demo';
import {ProgressBar} from 'primereact/progressbar';
import MainLayout from "@/Layouts/MainLayout";
import PageContainer from "@/PageContainer";
import {Head} from "@inertiajs/react";

let revenueChartData: ChartData;
let overviewChartData: ChartData;

function Dashboard({auth, csrfToken, errors}: {
    auth?: any,
    csrfToken?: string,
    errors?: any
}) {
    const {layoutConfig} = useContext(LayoutContext);
    const [products, setProducts] = useState<Demo.Product[]>([]);
    const [ordersOptions, setOrdersOptions] = useState<ChartOptions | null>(null);
    const [revenueChartOptions, setRevenueChartOptions] = useState<ChartOptions | null>(null);
    const [selectedOverviewWeek, setSelectedOverviewWeek] = useState<any>(null);

    const overviewWeeks: object[] = [
        {name: 'Bu Hafta', code: '0'},
        {name: 'Geçen Hafta', code: '1'}
    ];
    const selectWeek = () => {
        setSelectedOverviewWeek(overviewWeeks[0]);
    };
    const changeOverviewWeek = (e: DropdownChangeEvent) => {
        setSelectedOverviewWeek(e.value);
        const dataSet1 = [
            91,
            70,
            56,
            86,
            64,
        ];
        const dataSet2 = [
            52,
            70,
            55,
            68,
            79,
            56,
            74
        ];
        if (e.value.code === '1') {
            overviewChartData.datasets[0].data = dataSet2;
        } else {
            overviewChartData.datasets[0].data = dataSet1;
        }
        overviewChartData = {...overviewChartData};
    };

    const getOverviewChartData = (): any => {
        const documentStyle = getComputedStyle(document.documentElement);
        const primaryColor = documentStyle.getPropertyValue('--primary-color');
        const primaryColor300 = documentStyle.getPropertyValue('--primary-200');

        return {
            labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
            datasets: [
                {
                    label: 'Sipariş Adedi',
                    data: [
                        70,
                        68,
                        72,
                        56,
                        68,
                        90,
                        68
                    ],
                    backgroundColor: ['#007bff'],
                    hoverBackgroundColor: [primaryColor300],
                    fill: true,
                    borderRadius: '3',
                    borderSkipped: 'top bottom',
                    barPercentage: 0.25
                }
            ]
        };
    };
    const getRevenueChartData = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    data: [11, 17, 30, 60, 88, 92],
                    borderColor: 'rgba(25, 146, 212, 0.5)',
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'transparent',
                    fill: false,
                    tension: 0.4
                },
                {
                    data: [11, 19, 39, 59, 69, 71],
                    borderColor: 'rgba(25, 146, 212, 0.5)',
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'transparent',
                    fill: false,
                    tension: 0.4
                },
                {
                    data: [11, 17, 21, 30, 47, 83],
                    backgroundColor: 'rgba(25, 146, 212, 0.2)',
                    borderColor: 'rgba(25, 146, 212, 0.5)',
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'transparent',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    };
    const setSvg = (path: any) => {
        return `/demo/images/dashboard/${path}` + '.svg';
    };
    const dynamicBackground = () => {
        return 'rgba(227, 248, 255, 0.1)';
    };

    useEffect(() => {
        selectWeek();
    }, []);

    useEffect(() => {
        ProductService.getProductsSmall().then((data) => setProducts(data));
        const documentStyle = getComputedStyle(document.documentElement);
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        overviewChartData = getOverviewChartData();
        revenueChartData = getRevenueChartData();
        setOrdersOptions({
            plugins: {
                legend: {
                    position: 'bottom',
                    align: 'end',
                    labels: {
                        color: textColorSecondary
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            hover: {
                mode: 'index'
            },
            scales: {
                y: {
                    min: 0,
                    ticks: {
                        stepSize: 0,
                        color: textColorSecondary
                    },
                    grid: {
                        color: borderColor
                    }
                },
                x: {
                    grid: {
                        tickBorderDash: [2, 2],
                        display: true,
                        color: borderColor
                    },
                    ticks: {
                        color: textColorSecondary
                    }
                }
            }
        });
        setRevenueChartOptions({
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    grid: {
                        color: borderColor
                    },
                    max: 100,
                    min: 0,
                    ticks: {
                        color: textColorSecondary
                    }
                },
                x: {
                    grid: {
                        color: borderColor
                    },
                    ticks: {
                        color: textColorSecondary
                    }
                }
            }
        });
    }, [layoutConfig]);

    return (
        <PageContainer auth={auth} csrfToken={csrfToken} errors={errors}>
            <MainLayout>
                <Head title="İşletme Anasayfa"/>
                <div className="grid">
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card p-0 overflow-hidden flex flex-column">
                            <div className="flex align-items-center p-3">
                                <i className="pi pi-users text-6xl text-blue-500"></i>
                                <div className="ml-3">
                                    <span className="text-blue-500 block white-space-nowrap">TOPLAM MÜŞTERİ</span>
                                    <span className="text-blue-500 block text-4xl font-bold">3882</span>
                                </div>
                            </div>
                            <img src={setSvg('users')} className="w-full" alt="users"/>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card p-0 overflow-hidden flex flex-column">
                            <div className="flex align-items-center p-3">
                                <i className="pi pi-map text-6xl text-orange-500"></i>
                                <div className="ml-3">
                                    <span className="text-orange-500 block white-space-nowrap">TOPLAM SİPARİŞ</span>
                                    <span className="text-orange-500 block text-4xl font-bold">532</span>
                                </div>
                            </div>
                            <img src={setSvg('locations')} className="w-full" alt="locations"/>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card p-0 overflow-hidden flex flex-column">
                            <div className="flex align-items-center p-3">
                                <i className="pi pi-directions text-6xl text-green-500"></i>
                                <div className="ml-3">
                                    <span
                                        className="text-green-500 block white-space-nowrap">ORTALAMA TESLİM SÜRESİ</span>
                                    <span className="text-green-500 block text-4xl font-bold">25dk</span>
                                </div>
                            </div>
                            <img src={setSvg('rate')} className="w-full" alt="conversion"/>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card h-full p-0 overflow-hidden flex flex-column">
                            <div className="flex align-items-center p-3">
                                <i className="pi pi-comments text-6xl text-purple-500"></i>
                                <div className="ml-3">
                                    <span className="text-purple-500 block white-space-nowrap">KURYE BEKLEYEN SİPARİŞ ADEDİ</span>
                                    <span className="text-purple-500 block text-4xl font-bold">5</span>
                                </div>
                            </div>
                            <img src={setSvg('interactions')} className="w-full mt-auto" alt="interactions"/>
                        </div>
                    </div>

                    <div className="col-12 xl:col-6">
                        <div className="card h-full">
                            <div className="flex justify-content-between align-items-center mb-3">
                                <h5>Günlük Sipariş Grafiği</h5>
                                <Dropdown options={overviewWeeks} value={selectedOverviewWeek}
                                          onChange={changeOverviewWeek}
                                          optionLabel="name"></Dropdown>
                            </div>
                            <div className="graph">
                                <Chart type="bar" height="400px" data={overviewChartData}
                                       options={ordersOptions as ChartOptions}></Chart>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card h-full">
                            <h5>Son Müşteriler</h5>
                            <ul className="list-none p-0 m-0">
                                <li className="mb-4 flex align-items-center">
                                    <Avatar label="BÇ" size="large" shape="circle" className="text-base font-bold"
                                            style={{
                                                backgroundColor: 'rgba(101, 214, 173, 0.1)',
                                                color: '#27AB83',
                                                border: '1px solid #65D6AD'
                                            }}></Avatar>
                                    <div className="ml-3">
                                        <span className="block">Behzat Ç</span>
                                    </div>
                                </li>
                                <li className="mb-4 flex align-items-center">
                                    <Avatar label="AA" size="large" shape="circle" className="text-base font-bold"
                                            style={{
                                                backgroundColor: 'rgba(250, 219, 95, 0.1)',
                                                color: '#DE911D',
                                                border: '1px solid #FADB5F'
                                            }}></Avatar>
                                    <div className="ml-3">
                                        <span className="block">Adile Aydın</span>

                                    </div>
                                </li>
                                <li className="mb-4 flex align-items-center">
                                    <Avatar label="ECD" size="large" shape="circle" className="text-base font-bold"
                                            style={{
                                                backgroundColor: 'rgba(94, 208, 250, 0.1)',
                                                color: '#1992D4',
                                                border: '1px solid #5ED0FA'
                                            }}></Avatar>
                                    <div className="ml-3">
                                        <span className="block">Emir Can Değril</span>
                                    </div>
                                </li>
                                <li className="mb-4 flex align-items-center">
                                    <Avatar label="MÇ" size="large" shape="circle" className="text-base font-bold"
                                            style={{
                                                backgroundColor: 'rgba(250, 219, 95, 0.1)',
                                                color: '#DE911D',
                                                border: '1px solid #FADB5F'
                                            }}></Avatar>
                                    <div className="ml-3">
                                        <span className="block">Mehmet Ç</span>
                                    </div>
                                </li>
                                <li className="mb-4 flex align-items-center">
                                    <Avatar label="FM" size="large" shape="circle" className="text-base font-bold"
                                            style={{
                                                backgroundColor: 'rgba(94, 208, 250, 0.1)',
                                                color: '#1992D4',
                                                border: '1px solid #5ED0FA'
                                            }}></Avatar>
                                    <div className="ml-3">
                                        <span className="block">Furkan Mesal</span>
                                    </div>
                                </li>
                                <li className="mb-4 flex align-items-center">
                                    <Avatar label="MD" size="large" shape="circle" className="text-base font-bold"
                                            style={{
                                                backgroundColor: 'rgba(250, 219, 95, 0.1)',
                                                color: '#DE911D',
                                                border: '1px solid #FADB5F'
                                            }}></Avatar>
                                    <div className="ml-3">
                                        <span className="block">Mehmet Duran</span>
                                    </div>
                                </li>

                            </ul>
                            <Button type="button" className="w-full mt-3" label="Hepsini Görüntüle"
                                    icon="pi pi-arrow-right"
                                    iconPos="right"></Button>
                        </div>
                    </div>

                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card">
                            <div className="text-center mb-5">
                                <img src={setSvg('completion-graph')} alt="graph" className="w-full"/>
                            </div>

                            <ul className="list-none p-0 m-0">
                                <li className="mb-4 flex align-items-center justify-content-start">
                                    <Avatar icon="pi pi-user-edit" size="large" shape="circle"
                                            className="text-base font-bold" style={{
                                        backgroundColor: 'rgba(250, 219, 95, 0.1)',
                                        color: '#DE911D',
                                        border: '1px solid #FADB5F'
                                    }}></Avatar>
                                    <div className="ml-3">
                                        <span className="block">Add your personal information</span>
                                        <span className="text-blue-500 hover:underline cursor-pointer block font-bold">Go Profile Edit</span>
                                    </div>
                                </li>

                                <li className="mb-4 flex align-items-center justify-content-start">
                                    <Avatar icon="pi pi-send" size="large" shape="circle"
                                            className="text-base font-bold"
                                            style={{
                                                backgroundColor: 'rgba(250, 219, 95, 0.1)',
                                                color: '#DE911D',
                                                border: '1px solid #FADB5F'
                                            }}></Avatar>
                                    <div className="ml-3">
                                        <span className="block">Verify your phone</span>
                                        <span className="text-blue-500 hover:underline cursor-pointer block font-bold">Send Verification SMS</span>
                                    </div>
                                </li>

                                <li className="mb-4 flex align-items-center justify-content-start">
                                    <Avatar icon="pi pi-video" size="large" shape="circle"
                                            className="text-base font-bold"
                                            style={{
                                                backgroundColor: 'rgba(250, 219, 95, 0.1)',
                                                color: '#DE911D',
                                                border: '1px solid #FADB5F'
                                            }}></Avatar>
                                    <div className="ml-3">
                                        <span className="block">Verify your Face ID</span>
                                        <span className="text-blue-500 hover:underline cursor-pointer block font-bold">Upload Pictures</span>
                                    </div>
                                </li>

                                <li className="mb-4 flex align-items-center justify-content-start">
                                    <Avatar icon="pi pi-briefcase" size="large" shape="circle"
                                            className="text-base font-bold" style={{
                                        backgroundColor: 'rgba(250, 219, 95, 0.1)',
                                        color: '#DE911D',
                                        border: '1px solid #FADB5F'
                                    }}></Avatar>
                                    <div className="ml-3">
                                        <span className="block">Give permissions for personal data</span>
                                        <span className="text-blue-500 hover:underline cursor-pointer block font-bold">View Agreement</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </PageContainer>
    );
}

export default Dashboard;
