import React from "react";

function FloatingContact() {
  return (
    <div className="flex flex-col fixed bottom-20 pr-4 right-1 z-50 space-y-2">
      <a
        href="tel:0944469301"
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-flex items-center justify-center w-12 h-12 bg-red-900 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        <i className="fa fa-phone"></i>

        {/* Hiệu ứng "nổi bọt" */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-100 animate-ping"></span>
      </a>
    </div>
  );
}

export default FloatingContact;
