import React, { useState } from 'react';
import { MapPin, Building, Hash, Loader as Road } from 'lucide-react';
import { KUWAIT_GOVERNORATES, KuwaitAddress, formatKuwaitAddress } from '../../utils/kuwait';

interface KuwaitAddressFormProps {
  address?: KuwaitAddress;
  onAddressChange: (address: KuwaitAddress) => void;
  className?: string;
}

const KuwaitAddressForm: React.FC<KuwaitAddressFormProps> = ({
  address,
  onAddressChange,
  className = ''
}) => {
  const [formData, setFormData] = useState<KuwaitAddress>(
    address || {
      governorate: '',
      area: '',
      block: '',
      street: '',
      building: '',
      floor: '',
      apartment: '',
      additionalInfo: ''
    }
  );

  const handleChange = (field: keyof KuwaitAddress, value: string) => {
    const updatedAddress = { ...formData, [field]: value };
    setFormData(updatedAddress);
    onAddressChange(updatedAddress);
  };

  const selectedGovernorate = KUWAIT_GOVERNORATES[formData.governorate as keyof typeof KUWAIT_GOVERNORATES];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Governorate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4 inline mr-1" />
            Governorate / المحافظة
          </label>
          <select
            value={formData.governorate}
            onChange={(e) => handleChange('governorate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Select Governorate</option>
            {Object.entries(KUWAIT_GOVERNORATES).map(([key, gov]) => (
              <option key={key} value={key}>
                {gov.name} - {gov.nameAr}
              </option>
            ))}
          </select>
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area / المنطقة
          </label>
          <select
            value={formData.area}
            onChange={(e) => handleChange('area', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
            disabled={!selectedGovernorate}
          >
            <option value="">Select Area</option>
            {selectedGovernorate?.areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Block */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Hash className="h-4 w-4 inline mr-1" />
            Block / القطعة
          </label>
          <input
            type="text"
            value={formData.block}
            onChange={(e) => handleChange('block', e.target.value)}
            placeholder="e.g., 1, 2A, 15"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Street */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Road className="h-4 w-4 inline mr-1" />
            Street / الشارع
          </label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            placeholder="Street name or number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Building */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="h-4 w-4 inline mr-1" />
            Building / المبنى
          </label>
          <input
            type="text"
            value={formData.building}
            onChange={(e) => handleChange('building', e.target.value)}
            placeholder="Building number or name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Floor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Floor / الطابق (Optional)
          </label>
          <input
            type="text"
            value={formData.floor}
            onChange={(e) => handleChange('floor', e.target.value)}
            placeholder="e.g., Ground, 1, 2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Apartment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apartment / الشقة (Optional)
          </label>
          <input
            type="text"
            value={formData.apartment}
            onChange={(e) => handleChange('apartment', e.target.value)}
            placeholder="Apartment number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Information / معلومات إضافية (Optional)
        </label>
        <textarea
          value={formData.additionalInfo}
          onChange={(e) => handleChange('additionalInfo', e.target.value)}
          placeholder="Landmarks, special instructions, etc."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Address Preview */}
      {formData.governorate && formData.area && formData.block && formData.street && formData.building && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Address Preview:</h4>
          <p className="text-sm text-gray-600">{formatKuwaitAddress(formData)}</p>
          {selectedGovernorate && (
            <div className="mt-2 text-xs text-gray-500">
              Delivery Fee: KD {selectedGovernorate.deliveryFee.toFixed(3)} | 
              Estimated Time: {selectedGovernorate.deliveryTime}
            </div>
          )}
        </div>
      )}
      
      {/* Validation Messages */}
      {formData.governorate && formData.area && formData.block && formData.street && formData.building && (
        <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
          ✓ Address is complete and valid for delivery
        </div>
      )}
    </div>
  );
};

export default KuwaitAddressForm;