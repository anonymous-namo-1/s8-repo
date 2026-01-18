import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEO = ({
  title = "Syntheight - Premium Digital Assets",
  description = "High-quality digital assets for creators, developers, and business owners. Templates, workflows, and tools with lifetime access. One-time purchase.",
  keywords = "digital assets, premium templates, automation workflows, business tools, developer resources",
  image = "https://syntheight.com/images/workflow-product.png",
  url = "https://syntheight.com/",
  type = "website"
}) => {
  const fullTitle = title.includes('Syntheight') ? title : `${title} | Syntheight`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};
