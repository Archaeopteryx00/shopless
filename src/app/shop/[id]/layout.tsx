import { staticCatalog } from '@/infrastructure/catalog/staticCatalog';
import { getPublicProductionOrigin } from '@/services/shareUrl';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = staticCatalog.getProductById(params.id);
  if (!product) {
    return {
      title: 'Produk - Shopless',
    };
  }

  const origin = getPublicProductionOrigin();
  const imageUrl = product.image.startsWith('http')
    ? product.image
    : `${origin}${product.image}`;
  const shareUrl = `${origin}/shop/${product.id}`;
  const formattedPrice = new Intl.NumberFormat('id-ID').format(product.price);

  return {
    title: `${product.name} | Shopless`,
    description: `${product.description} - Rp ${formattedPrice}`,
    openGraph: {
      title: product.name,
      description: `${product.description} - Rp ${formattedPrice}`,
      url: shareUrl,
      siteName: 'Shopless',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: `${product.description} - Rp ${formattedPrice}`,
      images: [imageUrl],
    },
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
