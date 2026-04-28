"use client";
import { motion } from "framer-motion";
import { Camera, Receipt } from "lucide-react";

export function HeroFloaters() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute -bottom-6 -left-4 bg-white shadow-md rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm">
        <span className="w-7 h-7 rounded-md bg-success/10 text-success grid place-items-center"><Camera size={14} /></span>
        <div>
          <div className="font-medium">Foto anexada</div>
          <div className="text-xs text-ink-400">Job #4821 · Rua das Acácias</div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="absolute -top-4 -right-2 bg-white shadow-md rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm">
        <span className="w-7 h-7 rounded-md bg-blue-100 text-blue-600 grid place-items-center"><Receipt size={14} /></span>
        <div>
          <div className="font-medium">Fatura paga · R$ 1.240</div>
          <div className="text-xs text-ink-400">há 2 minutos</div>
        </div>
      </motion.div>
    </>
  );
}
