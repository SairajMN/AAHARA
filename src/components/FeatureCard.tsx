import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconBg: string;
  delay?: number;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const FeatureCard = ({
  icon,
  title,
  description,
  iconBg,
  delay = 0,
}: FeatureCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={delay}
      className="glass-card p-8 text-center hover-lift cursor-default"
    >
      <div
        className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
