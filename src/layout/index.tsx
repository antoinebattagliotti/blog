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
                <title>My Blog</title>
            </head>

            <body class={'min-h-svh w-screen overflow-hidden'}>{children}</body>
        </html>
    )
}
