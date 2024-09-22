import { JSX } from 'hono/dist/types/jsx/base'

export default function Layout({ children }: { children: JSX.Element }) {
    // Get the current month and year for footer
    const currentDate = new Date().toLocaleDateString('default', {
        month: 'short',
        year: '2-digit',
    })

    return (
        <html lang={'en'}>
            <head>
                <meta charset="UTF-8" />
                <meta name={'description'} content={'My Blog'} />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <script src="https://unpkg.com/htmx.org@2.0.2"></script>
                <script src="https://cdn.tailwindcss.com"></script>
                <title>awb-studio</title>
            </head>

            <body class={'min-h-svh w-screen'}>
                <header
                    class={
                        'fixed top-0 left-0 w-full px-6 py-1 flex items-center justify-start space-x-4 text-xs'
                    }
                >
                    <a href={'/'} class={'mr-auto cursor-pointer'}>
                        antoine
                    </a>

                    <a href={'/use-case'} class={'cursor-pointer'}>
                        work
                    </a>

                    <a href={'/strava'} class={'cursor-pointer'}>
                        trail
                    </a>

                    <a href={'/inspiration'} class={'cursor-pointer'}>
                        inspiration
                    </a>
                </header>

                <main
                    class={
                        'min-h-full flex items-center px-6 text-red-800 text-xs'
                    }
                >
                    {children}
                </main>

                <footer
                    class={
                        'fixed bottom-0 left-0 w-full px-6 py-1 text-xs italic flex justify-between uppercase'
                    }
                >
                    <a
                        href={'https://www.google.com'}
                        target={'_blank'}
                        class={'cursor-pointer'}
                    >
                        Email
                    </a>

                    <a
                        href={'https://www.google.com'}
                        target={'_blank'}
                        class={'cursor-pointer'}
                    >
                        LinkedIn
                    </a>

                    <a
                        href={'https://www.google.com'}
                        target={'_blank'}
                        class={'cursor-pointer'}
                    >
                        Strava
                    </a>

                    <div>{currentDate}</div>
                </footer>
            </body>
        </html>
    )
}
