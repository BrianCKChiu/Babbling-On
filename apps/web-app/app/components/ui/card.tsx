import Image from "next/image";

export default function Card({
  className,
  onClick,
  heading,
  preview,
}: {
  className?: string;
  onClick?: () => void;
  heading: string;
  preview: string;
}) {
  return (
    <div
      className={`flex flex-col h-28 w-12 border border-gray-300 rounded-lg ${className}`}
    >
      <Image
        className="w-full aspect-auto"
        src={preview}
        alt={`${heading}_sign_image`}
      />
      <div className="">{heading}</div>
    </div>
  );
}
