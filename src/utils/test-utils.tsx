import React, {ReactElement} from 'react'
import {render, RenderOptions} from '@testing-library/react'
import { createTheme, MantineProvider } from '@mantine/core'

const theme = createTheme({});

const AllTheProviders = ({children}: {children: React.ReactNode}) => {
  return (
    <MantineProvider theme={theme}>
        {children}
    </MantineProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: AllTheProviders, ...options})

export * from '@testing-library/react'
export {customRender as render}