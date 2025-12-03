'use client';

export function Pagination() {
  return (
    <div className="flex items-center justify-center py-2 md:py-8">
      <div className="flex items-center space-x-2">
        <span className="font-avantt font-semibold text-gray-800">01</span>
        <div className="w-12 h-0.5 bg-gray-800"></div>
        <span className="font-avantt text-gray-600">02</span>
        <span className="font-avantt text-gray-600">03</span>
      </div>
    </div>
  );
}
