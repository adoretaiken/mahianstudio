/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'motion/react';

interface Product {
  id: string;
  name: string;
  price: string;
  status: string;
  image: string;
  x: string;
  y: string;
}

const PRODUCTS: Product[] = [
  {
    id: '001',
    name: 'VANTAGE 5-PANEL',
    price: '৳699.00',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800',
    x: '15%',
    y: '20%',
  },
  {
    id: '002',
    name: 'BOOM CORDUROY',
    price: '৳899.00',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800',
    x: '70%',
    y: '15%',
  },
  {
    id: '003',
    name: 'CANVAS ARCHIVE',
    price: '৳579.00',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800',
    x: '45%',
    y: '50%',
  },
  {
    id: '004',
    name: 'UTILITY SNAPBACK',
    price: '৳999.00',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&q=80&w=800',
    x: '20%',
    y: '80%',
  },
  {
    id: '005',
    name: 'SHADOW SERIES',
    price: '৳799.00',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=800',
    x: '85%',
    y: '75%',
  },
  {
    id: '006',
    name: 'BOOM SIGNATURE',
    price: '৳699.00',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&q=80&w=800',
    x: '55%',
    y: '85%',
  },
];

const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="cursor-crosshair"
      style={{ x: mouseX, y: mouseY }}
    />
  );
};

const DataCard = ({ product, x, y }: { product: Product; x: number; y: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-[100] bg-white border border-black p-3 pointer-events-none"
      style={{ left: x + 20, top: y + 20 }}
    >
      <div className="text-[10px] font-mono leading-tight uppercase">
        <div>[{product.name}]</div>
        <div>[{product.price}]</div>
        <div>[STATUS: {product.status}]</div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Panning values
  const canvasX = useSpring(0, { damping: 20, stiffness: 50 });
  const canvasY = useSpring(0, { damping: 20, stiffness: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Calculate panning
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      const xRatio = (e.clientX / w - 0.5) * 2; // -1 to 1
      const yRatio = (e.clientY / h - 0.5) * 2; // -1 to 1
      
      // We want to pan up to 25% of viewport in each direction (total 50% extra)
      canvasX.set(-xRatio * (w * 0.25));
      canvasY.set(-yRatio * (h * 0.25));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [canvasX, canvasY]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F5F5F5] selection:bg-black selection:text-white">
      <CustomCursor />

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference text-white">
        <div className="text-[12px] font-mono tracking-widest uppercase cursor-pointer hover:opacity-50 transition-opacity">
          MENU
        </div>
        <h1 className="text-4xl md:text-6xl font-serif tracking-[0.3em] uppercase pointer-events-none">
          B O O M &nbsp; A V E N U E
        </h1>
        <div className="text-[12px] font-mono tracking-widest uppercase cursor-pointer hover:opacity-50 transition-opacity">
          CART (0)
        </div>
      </header>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-end mix-blend-difference text-white">
        <div className="text-[10px] font-mono tracking-widest uppercase opacity-60">
          ARCHIVE_REF: 23.7743° N, 90.4176° E
        </div>
        <div className="text-[10px] font-mono tracking-widest uppercase opacity-60 text-right">
          EST. 2024 // DHAKA
        </div>
      </footer>

      {/* The Canvas */}
      <motion.div 
        className="absolute w-[150vw] h-[150vh] grid-bg"
        style={{ 
          x: canvasX, 
          y: canvasY,
          left: '-25vw',
          top: '-25vh'
        }}
      >
        {PRODUCTS.map((product) => (
          <motion.div
            key={product.id}
            className="absolute cursor-pointer z-10 cap-shadow"
            style={{ left: product.x, top: product.y }}
            onMouseEnter={() => setHoveredProduct(product)}
            onMouseLeave={() => setHoveredProduct(null)}
            onClick={() => setSelectedProduct(product)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-48 h-48 md:w-64 md:h-64 object-contain mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Floating Data Card */}
      <AnimatePresence>
        {hoveredProduct && (
          <DataCard 
            product={hoveredProduct} 
            x={mousePos.x} 
            y={mousePos.y} 
          />
        )}
      </AnimatePresence>

      {/* Product Detail View (Hard Cut Zoom) */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#F5F5F5] flex flex-col items-center justify-center p-8"
          >
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-8 right-8 text-[12px] font-mono uppercase border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
            >
              CLOSE [ESC]
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl w-full">
              <div className="flex items-center justify-center border border-black/10 p-12">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-auto object-contain cap-shadow mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-2">
                  <div className="text-[12px] font-mono uppercase opacity-50">REF: {selectedProduct.id}</div>
                  <h2 className="text-5xl font-serif uppercase leading-tight">{selectedProduct.name}</h2>
                </div>
                
                <div className="border-y border-black py-8 space-y-4">
                  <div className="flex justify-between text-[14px] font-mono">
                    <span>PRICE</span>
                    <span>{selectedProduct.price}</span>
                  </div>
                  <div className="flex justify-between text-[14px] font-mono">
                    <span>STATUS</span>
                    <span>{selectedProduct.status}</span>
                  </div>
                  <div className="flex justify-between text-[14px] font-mono">
                    <span>MATERIAL</span>
                    <span>PREMIUM ARCHIVAL BLEND</span>
                  </div>
                </div>

                <button className="w-full bg-black text-white py-6 text-[14px] font-mono uppercase tracking-widest hover:opacity-80 transition-opacity">
                  ADD TO CART
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
