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
import {Skeleton} from "primereact/skeleton";
import CourierOrdersWidget from "@/components/CourierNearbyOrdersWidget";
import {getCourierStatics} from "@/helpers/Courier/account";
import CourierPastOrdersWidget from "@/components/CourierPastOrdersWidget";

let overviewChartData: ChartData;

function Dashboard({auth, csrfToken, errors, courierIsTransporting = false}: {
    auth?: any,
    csrfToken?: string,
    errors?: any,
    courierIsTransporting?: boolean
}) {

    const {layoutConfig} = useContext(LayoutContext);
    const [products, setProducts] = useState<Demo.Product[]>([]);
    const [ordersOptions, setOrdersOptions] = useState<ChartOptions | null>(null);
    const [revenueChartOptions, setRevenueChartOptions] = useState<ChartOptions | null>(null);
    const [selectedOverviewWeek, setSelectedOverviewWeek] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [statics, setStatics] = useState<any>({
        price: 0,
        speed: 0,
        time: 0,
        count: 0,
        graph: {
            thisWeek: {
                prices: [],
                counts: [],
                times: []
            },
            lastWeek: {
                prices: [],
                counts: [],
                times: []
            }
        }
    });
    const getStaticData = () => {
        setLoading(true);
        getCourierStatics(csrfToken).then((response: any) => {
            if (response.status) {
                setStatics(response.statics);
                overviewChartData.datasets[0].data = response.statics.graph.thisWeek.counts;
                overviewChartData.datasets[1].data = response.statics.graph.thisWeek.prices;
                overviewChartData.datasets[2].data = response.statics.graph.thisWeek.times;
                overviewChartData = {...overviewChartData};
            }
        })
    }
    useEffect(() => {
        getStaticData();
    }, [])
    const overviewWeeks: object[] = [
        {name: 'Bu Hafta', code: '0'},
        {name: 'Geçen Hafta', code: '1'}
    ];
    const selectWeek = () => {
        setSelectedOverviewWeek(overviewWeeks[0]);
    };
    const changeOverviewWeek = (e: DropdownChangeEvent) => {
        setSelectedOverviewWeek(e.value);
        if (e.value.code === '1') {
            overviewChartData.datasets[0].data = statics.graph.lastWeek.counts;
            overviewChartData.datasets[1].data = statics.graph.lastWeek.prices;
            overviewChartData.datasets[2].data = statics.graph.lastWeek.times;

        } else {
            overviewChartData.datasets[0].data = statics.graph.thisWeek.counts;
            overviewChartData.datasets[1].data = statics.graph.thisWeek.prices;
            overviewChartData.datasets[2].data = statics.graph.thisWeek.times;
        }
        overviewChartData = {...overviewChartData};
    };

    const getOverviewChartData = (): any => {
        const documentStyle = getComputedStyle(document.documentElement);
        const primaryColor = documentStyle.getPropertyValue('--primary-color');
        const primaryColor300 = documentStyle.getPropertyValue('--primary-600');

        return {
            labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
            datasets: [
                {
                    label: 'Sipariş Adedi',
                    data: [],
                    backgroundColor: [primaryColor],
                    hoverBackgroundColor: [primaryColor300],
                    fill: true,
                    borderRadius: '3',
                    borderSkipped: 'top bottom',
                    barPercentage: 0.5
                },
                {
                    label: 'Sipariş Ücreti (TL)',
                    data: [],
                    backgroundColor: [documentStyle.getPropertyValue('--cyan-300')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--cyan-600')],
                    fill: true,
                    borderRadius: '3',
                    borderSkipped: 'top bottom',
                    barPercentage: 0.5
                },
                {
                    label: 'Sipariş Teslimat Süresi (dk)',
                    data: [],
                    backgroundColor: [documentStyle.getPropertyValue('--pink-300')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--pink-600')],
                    fill: true,
                    borderRadius: '1',
                    borderSkipped: 'top bottom',
                    barPercentage: 0.5
                }
            ],
        };
    };


    const setSvg = (path: any) => {
        return `/demo/images/dashboard/${path}` + '.svg';
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
    }, [layoutConfig]);

    return (
        <PageContainer auth={auth} csrfToken={csrfToken} errors={errors} courierIsTransporting={courierIsTransporting}>
            <MainLayout>
                <Head title="Kurye Anasayfa"/>
                <div className="grid">
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card p-0 overflow-hidden flex flex-column">
                            <div className="flex align-items-center p-3">
                                <i className="pi pi-clock text-6xl text-blue-500"></i>
                                <div className="ml-3">
                                    <span
                                        className="text-blue-500 block white-space-nowrap">Ortalama Teslimat Süresi</span>
                                    <span className="text-blue-500 block text-4xl font-bold">{statics.time}dk</span>
                                </div>
                            </div>
                            <img src={setSvg('users')} className="w-full" alt="users"/>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card p-0 overflow-hidden flex flex-column">
                            <div className="flex align-items-center p-3">
                                <i className="pi pi-turkish-lira text-6xl text-orange-500"></i>
                                <div className="ml-3">
                                    <span className="text-orange-500 block white-space-nowrap">Elde Edilen Kazanç</span>
                                    <span className="text-orange-500 block text-4xl font-bold">{statics.price} ₺</span>
                                </div>
                            </div>
                            <img src={setSvg('locations')} className="w-full" alt="locations"/>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card h-full p-0 overflow-hidden flex flex-column">
                            <div className="flex align-items-center p-3">
                                <i className="pi pi-box text-6xl text-purple-500"></i>
                                <div className="ml-3">
                                    <span className="text-purple-500 block white-space-nowrap">Teslim Edilen Sipariş Adedi</span>
                                    <span className="text-purple-500 block text-4xl font-bold">{statics.count}</span>
                                </div>
                            </div>
                            <img src={setSvg('interactions')} className="w-full mt-auto" alt="interactions"/>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card p-0 overflow-hidden flex flex-column">
                            <div className="flex align-items-center p-3">
                                <i className="pi pi-bolt text-6xl text-green-500"></i>
                                <div className="ml-3">
                                    <span
                                        className="text-green-500 block white-space-nowrap">Siparişlerdeki Ortalama Hız</span>
                                    <span
                                        className="text-green-500 block text-4xl font-bold">{statics.speed}km/h </span>
                                </div>
                            </div>
                            <img src={setSvg('rate')} className="w-full" alt="conversion"/>
                        </div>
                    </div>

                    <div className="col-12 lg:col-6 xl:col-3">
                        <CourierOrdersWidget csrfToken={csrfToken}/>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <CourierPastOrdersWidget csrfToken={csrfToken}/>
                    </div>
                    <div className="col-12 xl:col-6">
                        <div className="card h-full">
                            <div className="flex justify-content-between align-items-center mb-3">
                                <h5>Günlük Sipariş Grafiği</h5>
                                <div>

                                    <Dropdown
                                        options={overviewWeeks}
                                        value={selectedOverviewWeek}
                                        onChange={changeOverviewWeek}
                                        optionLabel="name"
                                    />
                                    <Button
                                        icon={"pi pi-cloud-download"}
                                        tooltip={"PNG olarak kaydet"}
                                        tooltipOptions={{position: 'top'}}
                                        className={"ml-2"}
                                        severity={"secondary"}
                                        outlined
                                        onClick={() => {
                                            const element = document.querySelector('.graph canvas') as any;
                                            const canvas = document.createElement('canvas');
                                            canvas.width = element.width;
                                            canvas.height = element.height;
                                            const context = canvas.getContext('2d');
                                            if (context) {
                                                context.fillStyle = 'white';
                                                context.drawImage(element, 0, 0);
                                                const a = document.createElement('a');
                                                a.href = canvas.toDataURL('image/png');
                                                let downloadNameRandom = Math.random().toString(36).substring(7);
                                                a.download = `siparis-grafigi-${downloadNameRandom}.png`;
                                                a.click();
                                            }
                                        }}
                                    /><Button
                                    icon={"pi pi-print"}
                                    tooltip={"Yazdır"}
                                    tooltipOptions={{position: 'top'}}
                                    className={"ml-2"}
                                    severity={"secondary"}
                                    outlined
                                    onClick={async () => {
                                        // only print the chart
                                        const element = document.querySelector('.graph canvas') as any;
                                        const canvas = document.createElement('canvas');
                                        canvas.width = element.width;
                                        canvas.height = element.height;
                                        canvas.style.backgroundColor = '#000';
                                        const context = canvas.getContext('2d');
                                        if (context) {
                                            context.drawImage(element, 0, 0);
                                            const image = new Image();
                                            image.src = canvas.toDataURL('image/png', 1);
                                            // wait image to load
                                            await new Promise((resolve) => {
                                                image.onload = resolve;
                                            });
                                            const w = window.open("");
                                            w?.document.write(image.outerHTML);
                                            await w?.print();
                                            w?.close();
                                        }
                                    }}
                                />
                                </div>
                            </div>
                            <div className="graph">
                                <Chart type="bar" height="400px" data={overviewChartData}
                                       options={ordersOptions as ChartOptions}></Chart>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </PageContainer>
    );
}

export default Dashboard;
