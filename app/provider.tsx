import React from 'react'
import Header from './_components/header'

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <Header />
        {children}</div>
  )
}

export default Provider 