import React, { useState } from 'react';
import { UploadCloud, Download, FileText, Link } from 'lucide-react';
import PhoneImportModal from './PhoneImportModal';
import { SmartprixPhone } from '../../services/smartprixService';

interface BulkImportButtonProps {
  onImportComplete: (phones: SmartprixPhone[]) => void;
  className?: string;
}

const BulkImportButton: React.FC<BulkImportButtonProps> = ({ onImportComplete, className = '' }) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleImportComplete = (phones: SmartprixPhone[]) => {
    onImportComplete(phones);
    setShowImportModal(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center space-x-2 ${className}`}
        >
          <UploadCloud className="h-5 w-5" />
          <span>Bulk Import</span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              <button
                onClick={() => {
                  setShowImportModal(true);
                  setShowDropdown(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <UploadCloud className="h-4 w-4 mr-2 text-primary" />
                <span>Import Phone Models</span>
              </button>
              <button
                onClick={() => {
                  setShowImportModal(true);
                  setShowDropdown(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Link className="h-4 w-4 mr-2 text-blue-600" />
                <span>Import from URL</span>
              </button>
              <button
                onClick={() => {
                  setShowImportModal(true);
                  setShowDropdown(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <FileText className="h-4 w-4 mr-2 text-green-600" />
                <span>Import from CSV/Excel</span>
              </button>
              <hr className="my-1" />
              <button
                onClick={() => {
                  // This would download a template
                  setShowDropdown(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Download className="h-4 w-4 mr-2 text-gray-600" />
                <span>Download Template</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <PhoneImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
      />
    </>
  );
};

export default BulkImportButton;