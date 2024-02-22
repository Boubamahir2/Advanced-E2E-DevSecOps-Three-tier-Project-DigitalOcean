import React from 'react'
import { Outlet } from 'react-router-dom';
import { BigSidebar,SmallSidbar,Navbar } from '../../components';
import Wrapper from '../../assets/wrappers/SharedLayout';

const SharedLayouts = () => {
  return (
    <Wrapper>
      <main className='dashboard'>
        <SmallSidbar />
        <BigSidebar />
        <div>
          <Navbar />
          <div className="dashboard-page">
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  )
}

export default SharedLayouts