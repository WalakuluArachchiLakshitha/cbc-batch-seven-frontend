import { Link } from "react-router-dom";
import { FaLeaf, FaHandHoldingHeart, FaRecycle } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';

export default function AboutUs() {
    return (
        <div className="w-full min-h-screen bg-primary">
            <Helmet>
                <title>About Us - Cosmetic Shop</title>
                <meta name="description" content="Learn about our mission to provide natural, sustainable, and cruelty-free beauty products." />
            </Helmet>
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center bg-secondary text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-secondary/80 z-10"></div>
                <div className="relative z-20 text-center px-6">
                    <h1 className="text-5xl font-bold mb-4">Our Story</h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90">
                        Crafting natural beauty solutions with passion and integrity since 2020.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-secondary">
                            Beauty Rooted in Nature
                        </h2>
                        <p className="text-lg text-secondary/70 leading-relaxed">
                            We believe that true beauty comes from within and is enhanced by nature's finest ingredients. Our mission is to provide high-quality, sustainable, and effective cosmetic products that empower you to feel confident in your own skin.
                        </p>
                        <p className="text-lg text-secondary/70 leading-relaxed">
                            Every product in our collection is carefully formulated with ethically sourced ingredients, ensuring that you receive the best care without compromising on your values.
                        </p>
                    </div>
                    <div className="relative h-[400px] bg-accent/10 rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-accent/20 text-9xl">
                            🌿
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-white py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-secondary mb-12">
                        Our Core Values
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8 rounded-2xl bg-primary/30 hover:bg-primary/50 transition-colors">
                            <div className="text-accent text-5xl mb-6 flex justify-center">
                                <FaLeaf />
                            </div>
                            <h3 className="text-xl font-bold text-secondary mb-3">Natural Ingredients</h3>
                            <p className="text-secondary/70">
                                We prioritize plant-based, organic ingredients free from harmful chemicals and parabens.
                            </p>
                        </div>
                        <div className="text-center p-8 rounded-2xl bg-primary/30 hover:bg-primary/50 transition-colors">
                            <div className="text-accent text-5xl mb-6 flex justify-center">
                                <FaHandHoldingHeart />
                            </div>
                            <h3 className="text-xl font-bold text-secondary mb-3">Cruelty-Free</h3>
                            <p className="text-secondary/70">
                                Adding beauty shouldn't cost a life. All our products are 100% cruelty-free and vegan-friendly.
                            </p>
                        </div>
                        <div className="text-center p-8 rounded-2xl bg-primary/30 hover:bg-primary/50 transition-colors">
                            <div className="text-accent text-5xl mb-6 flex justify-center">
                                <FaRecycle />
                            </div>
                            <h3 className="text-xl font-bold text-secondary mb-3">Sustainability</h3>
                            <p className="text-secondary/70">
                                From sourcing to packaging, we are committed to reducing our environmental footprint.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 text-center">
                <h2 className="text-3xl font-bold text-secondary mb-6">
                    Ready to Experience the Difference?
                </h2>
                <Link
                    to="/products"
                    className="inline-block bg-accent text-white px-8 py-3 rounded-full font-semibold hover:bg-accent/90 transition-colors shadow-lg hover:shadow-xl"
                >
                    Shop Our Collection
                </Link>
            </section>
        </div>
    );
}
