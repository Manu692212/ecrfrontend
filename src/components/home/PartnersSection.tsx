const partners = [
  { name: 'Air India', abbr: 'AI' },
  { name: 'IndiGo', abbr: 'IG' },
  { name: 'SpiceJet', abbr: 'SJ' },
  { name: 'Vistara', abbr: 'VS' },
  { name: 'Go First', abbr: 'GF' },
  { name: 'Emirates', abbr: 'EK' },
  { name: 'Singapore Airlines', abbr: 'SQ' },
  { name: 'Qatar Airways', abbr: 'QR' },
];

const PartnersSection = () => {
  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="ecr-container">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Top Hiring Companies and Partners
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center w-24 h-12 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-all group"
            >
              <span className="font-display text-lg font-bold text-muted-foreground group-hover:text-primary transition-colors">
                {partner.abbr}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
