import { JSX } from 'hono/dist/types/jsx/base'

export default function Layout({ children }: { children: JSX.Element }) {
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

            <body
                class={
                    'min-h-svh w-screen overflow-hidden flex flex-col space-y-4 px-24 pt-24 pb-8 bg-white'
                }
            >
                <header
                    class={
                        'w-full flex items-center justify-start space-x-4 text-xs'
                    }
                >
                    <a href={'/'} class={'mr-auto'}>
                        antoine
                    </a>

                    <a href={'/use-case'}>use-case</a>

                    <a href={'/strava'}>strava</a>

                    <a href={'/inspiration'}>inspiration</a>
                </header>

                <main class={'grow bg-red-50 text-red-800 text-sm'}>
                    {children}
                </main>

                <footer class={'text-xs'}>Developed by me.</footer>
            </body>
        </html>
    )
}
