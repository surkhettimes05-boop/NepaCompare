import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  params: {
    brand: string;
    model: string;
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getVehicles() {
  try {
    const res = await fetch(`${API_URL}/seo/vehicles`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles.map((v: any) => {
    return {
      brand: v.brandSlug || v.slug.split('-')[0] || 'unknown',
      model: v.slug.split('-').slice(1).join('-') || 'unknown'
    };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vehicles = await getVehicles();
  const fullSlug = `${params.brand}-${params.model}`;
  const vehicle = vehicles.find((v: any) => v.slug === fullSlug);
  
  if (!vehicle) return { title: 'Bike Not Found' };

  return {
    title: `${vehicle.brand} ${vehicle.name} Insurance Price in Nepal (2026)`,
    description: `Get the cheapest third-party and comprehensive insurance for your ${vehicle.brand} ${vehicle.name} (${vehicle.cc}cc). Compare quotes from top Nepali insurers instantly.`,
  };
}

export default async function ProgrammaticBikePage({ params }: Props) {
  const vehicles = await getVehicles();
  const fullSlug = `${params.brand}-${params.model}`;
  const vehicle = vehicles.find((v: any) => v.slug === fullSlug);

  // If we don't have this exact model in DB, we still render a dynamic page but with generic data
  // to capture the long-tail keyword anyway.
  const safeBrand = params.brand || 'bike';
  const safeModel = params.model || 'model';
  const displayBrand = vehicle ? vehicle.brand : safeBrand.charAt(0).toUpperCase() + safeBrand.slice(1);
  const displayModel = vehicle ? vehicle.name : safeModel.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const displayCC = vehicle ? vehicle.cc : '150'; // Default guess if not in DB
  const displayPremium = vehicle ? vehicle.basePremium : 4500;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <div style={{ background: 'var(--primary-color)', color: 'white', padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase' }}>
            Two-Wheeler Insurance
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
            {displayBrand} {displayModel} Insurance in Nepal
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Secure your {displayBrand} {displayModel} with the best comprehensive or third-party insurance. Compare quotes from 14+ top insurers instantly.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '800px', margin: '3rem auto' }}>
        {/* SEO Content Block */}
        <div className="card" style={{ padding: '3rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-color)', marginBottom: '1rem' }}>
            How much does insurance cost for a {displayBrand} {displayModel}?
          </h2>
          <p style={{ color: 'var(--text-color)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            In Nepal, the third-party premium for a {displayCC}cc bike is fixed by the Beema Samiti. However, if you are looking for comprehensive cover (which we highly recommend for a {displayBrand}), the price will depend on the vehicle's age and current market value.
          </p>
          <p style={{ color: 'var(--text-color)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Based on current market rates, expect a base comprehensive premium starting around <strong>NPR {displayPremium}</strong> per year for your {displayModel}.
          </p>
          
          <div style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-accent)' }}>
            <strong>Did you know?</strong> You can save up to 15% on your renewal premium if you haven't claimed insurance in the past year (No Claim Bonus).
          </div>
        </div>

        {/* Action CTA */}
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-color)', marginBottom: '1rem' }}>
            Ready to see exact quotes for your {displayBrand}?
          </h3>
          <Link href={`/wizard/motor?type=bike&brand=${params.brand}&model=${params.model}`} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
            Compare Rates Now
          </Link>
        </div>
      </div>
    </div>
  );
}
