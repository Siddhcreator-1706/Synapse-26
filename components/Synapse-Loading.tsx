"use client";
import JokerSliding from "@/components/Joker-sliding";

interface SynapseLoadingProps {
  onComplete?: () => void;
}

export default function SynapseLoading({ onComplete }: SynapseLoadingProps) {
    return (
        <div className="fixed inset-0 w-full h-full overflow-visible">
            <JokerSliding onComplete={onComplete} autoPlay={true} />
        </div>
    );
}