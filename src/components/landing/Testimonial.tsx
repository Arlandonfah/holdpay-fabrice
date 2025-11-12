import { Star, Quote } from "lucide-react";

export default function Testimonial() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Quote Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <Quote className="h-12 w-12 text-primary" />
            </div>
          </div>

          {/* Testimonial */}
          <blockquote className="text-3xl md:text-4xl font-bold leading-relaxed mb-12">
            "J'ai sécurisé plus de{" "}
            <span className="gradient-text">12 000€</span>{" "}
            d'acomptes avec Holdpay.{" "}
            <span className="gradient-text">Mes clients adorent</span>{" "}
            la transparence du processus."
          </blockquote>

          {/* Author */}
          <div className="flex items-center justify-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg">Marie Dubois</div>
              <div className="text-muted-foreground">Développeuse Web Freelance</div>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}