
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";

interface CollectionItemProps {
  title: string;
  link: string;
}

const collections: CollectionItemProps[] = [
  { title: "Air Rifle", link: "/collections/air-rifle" },
  { title: "Air Pistols", link: "/collections/air-pistols" },
  { title: "CO2 Pistols", link: "/collections/co2-pistols" },
  { title: "Air Pellets", link: "/collections/air-pellets" },
  { title: "Air Rifle Accessories", link: "/collections/air-rifle-accessories" },
  { title: "Air Pistol Accessories", link: "/collections/air-pistol-accessories" },
  { title: "Electronic Target Systems", link: "/collections/electronic-target-systems" },
  { title: "Scatt Training Systems", link: "/collections/scatt-training-systems" },
  { title: "Essentials", link: "/collections/essentials" },
  { title: "Consumables", link: "/collections/consumables" }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const CollectionItem: React.FC<CollectionItemProps> = ({ title, link }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <motion.div 
      variants={item}
      className="group"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link to={link}>
        <Card className={cn(
          "h-full overflow-hidden",
          isDark ? "bg-mangla-dark-gray border-gray-800" : "bg-white border-gray-300"
        )}>
          <CardContent className="p-6">
            <h3 className={cn(
              "text-xl font-semibold mb-2 group-hover:text-mangla-gold transition-colors",
              isDark ? "text-white" : "text-slate-900"
            )}>
              {title}
            </h3>
            <div className={cn(
              "mt-3 w-10 h-0.5 transition-all duration-300 group-hover:w-24",
              isDark ? "bg-mangla-gold" : "bg-amber-400"
            )}></div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const FeaturedCollections: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section id="featured-collections" className={cn(
      "py-16 md:py-20", 
      isDark ? "bg-mangla-dark-gray/40" : "bg-slate-50"
    )}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <motion.div 
            className="mb-6 md:mb-0"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={cn(
              "section-title text-4xl md:text-5xl font-bold",
              isDark ? "text-white" : "text-slate-900"
            )}>
              Featured Collections
            </h2>
            <motion.div 
              className={cn(
                "w-20 h-1 mt-2 mb-4",
                isDark ? "bg-mangla-gold" : "bg-amber-500"
              )}
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            ></motion.div>
            <p className={cn(
              "max-w-2xl",
              isDark ? "text-gray-300" : "text-slate-700"
            )}>
              Explore our curated collections designed for champions and enthusiasts alike
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              variant={isDark ? "outline" : "default"}
              className={cn(
                "group font-medium",
                isDark ? "border-mangla-gold text-mangla-gold hover:bg-mangla-gold hover:text-black" : 
                "bg-amber-500 text-white hover:bg-amber-600"
              )}
              asChild
            >
              <Link to="/collections">
                View All Collections 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {collections.map((collection, index) => (
            <CollectionItem 
              key={index} 
              title={collection.title}
              link={collection.link}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
