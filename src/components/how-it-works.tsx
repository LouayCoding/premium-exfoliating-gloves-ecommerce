'use client';

export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Natmaken",
      description: "5 min onder de warme douche. Geen zeep gebruiken."
    },
    {
      number: "2",
      title: "Scrubben",
      description: "Wrijf stevig (zonder druk!) op en neer. Je zult de magie zien."
    },
    {
      number: "3",
      title: "Spoelen",
      description: "Spoel je huid en de HDS Washandje grondig af."
    },
    {
      number: "4",
      title: "Hydrateren",
      description: "Droog je huid en gebruik je favoriete bodylotion of olie."
    }
  ];

  return (
    <section className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-avantt font-bold text-gray-900 mb-3">
            Hoe gebruik je het?
          </h2>
          <p className="text-base font-avantt text-gray-600">
            4 simpele stappen naar zijdezachte huid
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="text-center"
            >
              {/* Gouden cirkel met nummer */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center">
                  <span className="text-2xl font-avantt font-bold text-[#1a1a1a]">
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-avantt font-bold text-gray-900 mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm font-avantt text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
