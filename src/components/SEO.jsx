// components/SEO.jsx

import { Helmet } from "react-helmet-async";

export default function SEO({
    title,
    description,
    image = "https://insanjo.com/images/logoBox.png",
    url = "https://insanjo.com",
}) {
    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "Insanjo",
                    "applicationCategory": "BusinessApplication",
                    "operatingSystem": "Web",
                    "url": "https://insanjo.com",
                    "description":
                        "Business management software for African vendors.",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    }
                })}
            </script>

            <title>{title}</title>

            <meta name="description" content={description} />

            <meta
                name="keywords"
                content="business management, POS, inventory management, bookkeeping, African businesses, sales tracking, vendor software, analytics, stock management, Insanjo"
            />

            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content="Insanjo" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:site" content="@insanjo" />
            <meta name="twitter:creator" content="@insanjo" />

            {/* Search Engines */}
            <meta name="robots" content="index, follow" />

            <link rel="canonical" href="https://insanjo.com/" />

            {/* Theme */}
            <meta name="theme-color" content="#0B6CF2" />
        </Helmet>
    );
}