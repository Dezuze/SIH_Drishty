import React from 'react';
import { ShieldCheck, Award, Sprout, Network } from 'lucide-react';
import './TrustSection.css';

export function TrustSection() {
  const trustItems = [
    {
      icon: <ShieldCheck size={24} strokeWidth={2.2} />,
      title: 'Verified Producers',
      colorTheme: 'sprout',
      description:
        'Every farmer, estate, and cooperative undergoes physical land holding audits, crop registration, and identity checks.'
    },
    {
      icon: <Award size={24} strokeWidth={2.2} />,
      title: 'GI-Origin Recognition',
      colorTheme: 'gold',
      description:
        'Authenticating native geographical indicators such as Wayanad Robusta, Marayoor Jaggery, and Palakkadan Matta Rice.'
    },
    {
      icon: <Sprout size={24} strokeWidth={2.2} />,
      title: 'Direct Farm Sourcing',
      colorTheme: 'orange',
      description:
        'Eliminating middleman markups so Kerala growers receive fair, dignified earnings while buyers receive fresh harvests.'
    },
    {
      icon: <Network size={24} strokeWidth={2.2} />,
      title: 'Transparent Marketplace',
      colorTheme: 'forest',
      description:
        'Complete batch-level harvest traceability, cold-chain routing updates, and direct communication with growing societies.'
    }
  ];

  return (
    <section className="trust-section" aria-labelledby="trust-section-title">
      <div className="vendors-content-container">
        <div className="trust-header">
          <span className="trust-eyebrow">AGRICULTURAL ASSURANCE</span>
          <h2 id="trust-section-title" className="trust-title">
            Rooted in Trust
          </h2>
          <p className="trust-subtitle">
            Every vendor represents a real agricultural source, helping buyers understand where their produce comes from and who grows it.
          </p>
        </div>

        <div className="trust-grid">
          {trustItems.map((item, index) => (
            <article key={index} className={`trust-card card-theme-${item.colorTheme}`}>
              <div className={`trust-icon-box icon-theme-${item.colorTheme}`} aria-hidden="true">
                {item.icon}
              </div>
              <h3 className="trust-card-title">{item.title}</h3>
              <p className="trust-card-text">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
