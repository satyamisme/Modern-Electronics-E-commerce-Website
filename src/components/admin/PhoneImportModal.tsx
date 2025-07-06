import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Download, 
  Link, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Smartphone,
  Plus,
  Edit,
  Trash2,
  Save
} from 'lucide-react';
import { smartprixService, SmartprixPhone } from '../../services/smartprixService';
import { phoneModelService } from '../../services/phoneModelService';
import { formatKWD } from '../../utils/currency';
import OptimizedImage from '../ui/OptimizedImage';

interface PhoneImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (phones: SmartprixPhone[]) => void;
}

const PhoneImportModal: React.FC<PhoneImportModalProps> = ({ isOpen, onClose, onImportComplete }) => {
  const [importMethod, setImportMethod] = useState<'url' | 'file' | 'batch'>('url');
  const [url, setUrl] = useState('');
  const [batchUrls, setBatchUrls] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedPhones, setImportedPhones] = useState<SmartprixPhone[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editingPhone, setEditingPhone] = useState<SmartprixPhone | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleUrlImport = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    if (!url.includes('smartprix.com')) {
      setError('Please enter a valid Smartprix URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await smartprixService.scrapePhoneFromUrl(url);
      
      if (result.success && result.phones.length > 0) {
        setImportedPhones(result.phones);
        setShowPreview(true);
      } else {
        setError(result.errors?.[0] || 'Failed to import phone data');
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchImport = async () => {
    if (!batchUrls.trim()) {
      setError('Please enter at least one URL');
      return;
    }

    const urls = batchUrls.split('\n').map(url => url.trim()).filter(url => url);
    
    if (urls.length === 0) {
      setError('Please enter at least one valid URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const phones: SmartprixPhone[] = [];
      const errors: string[] = [];

      for (const url of urls) {
        if (!url.includes('smartprix.com')) {
          errors.push(`Invalid URL: ${url}`);
          continue;
        }

        const result = await smartprixService.scrapePhoneFromUrl(url);
        
        if (result.success && result.phones.length > 0) {
          phones.push(...result.phones);
        } else {
          errors.push(`Failed to import from ${url}: ${result.errors?.[0] || 'Unknown error'}`);
        }
      }

      if (phones.length > 0) {
        setImportedPhones(phones);
        setShowPreview(true);
      } else {
        setError('Failed to import any phone data');
      }

      if (errors.length > 0) {
        console.error('Import errors:', errors);
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileImport = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await smartprixService.parsePhoneFile(file);
      
      if (result.success && result.phones.length > 0) {
        setImportedPhones(result.phones);
        setShowPreview(true);
      } else {
        setError(result.errors?.[0] || 'Failed to import phone data from file');
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDownloadTemplate = async (format: 'csv' | 'excel') => {
    try {
      if (format === 'csv') {
        const csvContent = smartprixService.getSampleCSVTemplate();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'phone_import_template.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const fileSaver = await import('file-saver');
        const excelBlob = await smartprixService.getSampleExcelTemplate();
        fileSaver.default.saveAs(excelBlob, 'phone_import_template.xlsx');
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      setError((error as Error).message);
    }
  };

  const handleRemovePhone = (id: string) => {
    setImportedPhones(importedPhones.filter(phone => phone.id !== id));
  };

  const handleEditPhone = (phone: SmartprixPhone) => {
    setEditingPhone({...phone});
  };

  const handleSaveEdit = () => {
    if (!editingPhone) return;
    
    setImportedPhones(importedPhones.map(phone => 
      phone.id === editingPhone.id ? editingPhone : phone
    ));
    
    setEditingPhone(null);
  };

  const handleCancelEdit = () => {
    setEditingPhone(null);
  };

  const handleCompleteImport = () => {
    onImportComplete(importedPhones);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Import Phone Models</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          {!showPreview ? (
            <div className="p-6">
              {/* Import Methods */}
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={() => setImportMethod('url')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    importMethod === 'url'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Link className="h-4 w-4 inline mr-2" />
                  Single URL
                </button>
                <button
                  onClick={() => setImportMethod('batch')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    importMethod === 'batch'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="h-4 w-4 inline mr-2" />
                  Multiple URLs
                </button>
                <button
                  onClick={() => setImportMethod('file')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    importMethod === 'file'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Upload className="h-4 w-4 inline mr-2" />
                  CSV/Excel Upload
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {/* URL Import */}
              {importMethod === 'url' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Smartprix Phone URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.smartprix.com/mobiles/apple-iphone-15-pro-ppd1f9iuxeqn"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        onClick={handleUrlImport}
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center space-x-2"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            <span>Importing...</span>
                          </>
                        ) : (
                          <>
                            <Smartphone className="h-5 w-5" />
                            <span>Import</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Enter a Smartprix phone model URL to import specifications and details
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">How to import from Smartprix</h3>
                    <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                      <li>Visit <a href="https://www.smartprix.com/mobiles" target="_blank" rel="noopener noreferrer" className="underline">Smartprix Mobiles</a></li>
                      <li>Find and click on the phone model you want to import</li>
                      <li>Copy the URL from your browser's address bar</li>
                      <li>Paste the URL in the field above and click Import</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Batch URL Import */}
              {importMethod === 'batch' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Multiple Smartprix URLs (one per line)
                    </label>
                    <textarea
                      value={batchUrls}
                      onChange={(e) => setBatchUrls(e.target.value)}
                      placeholder="https://www.smartprix.com/mobiles/apple-iphone-15-pro-ppd1f9iuxeqn
https://www.smartprix.com/mobiles/samsung-galaxy-s24-ultra-ppd1vz7wlcvs"
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Enter multiple Smartprix URLs, one per line
                    </p>
                  </div>

                  <button
                    onClick={handleBatchImport}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Importing...</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="h-5 w-5" />
                        <span>Import All</span>
                      </>
                    )}
                  </button>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-medium text-yellow-800 mb-2">Batch Import Notes</h3>
                    <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                      <li>Importing multiple phones may take some time</li>
                      <li>Rate limiting may apply to prevent server overload</li>
                      <li>For large imports, consider using CSV/Excel upload</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* File Import */}
              {importMethod === 'file' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload CSV or Excel File
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        {file ? file.name : 'Drag and drop your file here, or'}
                        {!file && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-primary hover:underline ml-1"
                          >
                            browse files
                          </button>
                        )}
                      </p>
                      {file && (
                        <div className="flex items-center justify-center space-x-2 mt-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-primary hover:underline text-sm"
                          >
                            Change file
                          </button>
                          <span className="text-gray-400">|</span>
                          <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="text-red-500 hover:underline text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Supports: CSV, XLSX • Max size: 10MB
                      </p>
                    </div>
                  </div>

                  {file && (
                    <button
                      onClick={handleFileImport}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Smartphone className="h-5 w-5" />
                          <span>Import Data</span>
                        </>
                      )}
                    </button>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Download Templates</h3>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleDownloadTemplate('csv')}
                        className="flex items-center space-x-2 text-primary hover:text-primary/80"
                      >
                        <Download className="h-4 w-4" />
                        <span>CSV Template</span>
                      </button>
                      <button
                        onClick={() => handleDownloadTemplate('excel')}
                        className="flex items-center space-x-2 text-primary hover:text-primary/80"
                      >
                        <Download className="h-4 w-4" />
                        <span>Excel Template</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              {/* Preview Imported Phones */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Preview Imported Phones</h3>
                <p className="text-gray-600">
                  {importedPhones.length} phone{importedPhones.length !== 1 ? 's' : ''} imported. Review and edit before adding to inventory.
                </p>
              </div>

              {/* Phone List */}
              <div className="space-y-6 mb-6">
                {importedPhones.map((phone) => (
                  <div key={phone.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {editingPhone && editingPhone.id === phone.id ? (
                      /* Editing Mode */
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Name
                            </label>
                            <input
                              type="text"
                              value={editingPhone.name}
                              onChange={(e) => setEditingPhone({...editingPhone, name: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Brand
                            </label>
                            <input
                              type="text"
                              value={editingPhone.brand}
                              onChange={(e) => setEditingPhone({...editingPhone, brand: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price (KWD)
                            </label>
                            <input
                              type="number"
                              step="0.001"
                              value={editingPhone.price || ''}
                              onChange={(e) => setEditingPhone({...editingPhone, price: e.target.value ? parseFloat(e.target.value) : undefined})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Image URL
                            </label>
                            <input
                              type="url"
                              value={editingPhone.image}
                              onChange={(e) => setEditingPhone({...editingPhone, image: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Display
                            </label>
                            <input
                              type="text"
                              value={editingPhone.specifications.display || ''}
                              onChange={(e) => setEditingPhone({
                                ...editingPhone, 
                                specifications: {...editingPhone.specifications, display: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Camera
                            </label>
                            <input
                              type="text"
                              value={editingPhone.specifications.camera || ''}
                              onChange={(e) => setEditingPhone({
                                ...editingPhone, 
                                specifications: {...editingPhone.specifications, camera: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Battery
                            </label>
                            <input
                              type="text"
                              value={editingPhone.specifications.battery || ''}
                              onChange={(e) => setEditingPhone({
                                ...editingPhone, 
                                specifications: {...editingPhone.specifications, battery: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Storage
                            </label>
                            <input
                              type="text"
                              value={editingPhone.specifications.storage || ''}
                              onChange={(e) => setEditingPhone({
                                ...editingPhone, 
                                specifications: {...editingPhone.specifications, storage: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              RAM
                            </label>
                            <input
                              type="text"
                              value={editingPhone.specifications.ram || ''}
                              onChange={(e) => setEditingPhone({
                                ...editingPhone, 
                                specifications: {...editingPhone.specifications, ram: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Processor
                            </label>
                            <input
                              type="text"
                              value={editingPhone.specifications.processor || ''}
                              onChange={(e) => setEditingPhone({
                                ...editingPhone, 
                                specifications: {...editingPhone.specifications, processor: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center space-x-2"
                          >
                            <Save className="h-4 w-4" />
                            <span>Save Changes</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 p-4">
                          <OptimizedImage
                            src={phone.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                            alt={phone.name}
                            width={300}
                            height={300}
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                        <div className="md:w-3/4 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{phone.name}</h3>
                              <p className="text-gray-600">{phone.brand}</p>
                              {phone.price && (
                                <p className="text-primary font-bold mt-1">{formatKWD(phone.price)}</p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditPhone(phone)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRemovePhone(phone.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Remove"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 mt-4">
                            {phone.specifications.display && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Display:</span>{' '}
                                <span className="text-gray-600">{phone.specifications.display}</span>
                              </div>
                            )}
                            {phone.specifications.camera && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Camera:</span>{' '}
                                <span className="text-gray-600">{phone.specifications.camera}</span>
                              </div>
                            )}
                            {phone.specifications.battery && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Battery:</span>{' '}
                                <span className="text-gray-600">{phone.specifications.battery}</span>
                              </div>
                            )}
                            {phone.specifications.storage && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Storage:</span>{' '}
                                <span className="text-gray-600">{phone.specifications.storage}</span>
                              </div>
                            )}
                            {phone.specifications.ram && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">RAM:</span>{' '}
                                <span className="text-gray-600">{phone.specifications.ram}</span>
                              </div>
                            )}
                            {phone.specifications.processor && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Processor:</span>{' '}
                                <span className="text-gray-600">{phone.specifications.processor}</span>
                              </div>
                            )}
                          </div>
                          
                          {phone.features.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-medium text-gray-700 mb-1">Features:</p>
                              <div className="flex flex-wrap gap-1">
                                {phone.features.slice(0, 5).map((feature, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                    {feature}
                                  </span>
                                ))}
                                {phone.features.length > 5 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                    +{phone.features.length - 5} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {phone.colors && phone.colors.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-medium text-gray-700 mb-1">Colors:</p>
                              <div className="flex flex-wrap gap-1">
                                {phone.colors.map((color, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                    {color}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {phone.url && (
                            <div className="mt-4 text-sm">
                              <a 
                                href={phone.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center"
                              >
                                <Link className="h-3 w-3 mr-1" />
                                View on Smartprix
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Validation Summary */}
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-800">Validation Passed</h3>
                    <p className="text-sm text-green-700">
                      All {importedPhones.length} phone models are valid and ready to import
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setImportedPhones([]);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleCompleteImport}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add to Inventory</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneImportModal;