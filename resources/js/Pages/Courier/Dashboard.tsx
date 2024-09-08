'use client';
import React, {useContext, useEffect, useState} from 'react';
import MainLayout from "@/Layouts/MainLayout";
import PageContainer from "@/PageContainer";
import PersonalInformation from "@/Pages/Courier/PersonalInformation";


function Dashboard({auth, csrfToken, errors}: {
    auth?: any,
    csrfToken?: string,
    errors?: any
}) {
    return (
        <PageContainer auth={auth} csrfToken={csrfToken} errors={errors}>
            <MainLayout>
                s
            </MainLayout>
        </PageContainer>
    );
}

export default Dashboard;
