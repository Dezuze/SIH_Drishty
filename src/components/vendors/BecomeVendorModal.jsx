import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Sprout, ArrowRight } from 'lucide-react';
import { KERALA_DISTRICTS } from '../../data/vendorsData';
import './BecomeVendorModal.css';

export function BecomeVendorModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    farmName: '',
    growerName: '',
    phone: '',
    email: '',
    district: 'Wayanad',
    acreage: '',
    primaryProduce: '',
    isGiTagged: 'no',
    isOrganic: 'yes',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleModalClose = () => {
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="become-vendor-overlay"
      onClick={handleModalClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="become-vendor-title"
    >
      <div className="become-vendor-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="become-vendor-close-btn"
          onClick={handleModalClose}
          aria-label="Close form"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="become-vendor-header">
              <span className="become-vendor-eyebrow">GROWER ONBOARDING</span>
              <h2 id="become-vendor-title" className="become-vendor-title">
                Become a Verified Producer
              </h2>
              <p className="become-vendor-subtitle">
                Join Haritha Heritage Agritech to bring your authenticated Kerala harvest directly to discerning households and verified institutional buyers.
              </p>
            </div>

            <form className="become-vendor-form" onSubmit={handleSubmit}>
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="farmName" className="form-label">
                    Farm / Cooperative Name *
                  </label>
                  <input
                    type="text"
                    id="farmName"
                    name="farmName"
                    required
                    placeholder="e.g. Wayanad Spices Guild"
                    className="form-input"
                    value={formData.farmName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="growerName" className="form-label">
                    Lead Farmer / Contact Person *
                  </label>
                  <input
                    type="text"
                    id="growerName"
                    name="growerName"
                    required
                    placeholder="Full legal name"
                    className="form-input"
                    value={formData.growerName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="district" className="form-label">
                    District *
                  </label>
                  <select
                    id="district"
                    name="district"
                    required
                    className="form-select"
                    value={formData.district}
                    onChange={handleChange}
                  >
                    {KERALA_DISTRICTS.filter((d) => d !== 'All Districts').map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="acreage" className="form-label">
                    Cultivated Land Holding (Acres) *
                  </label>
                  <input
                    type="number"
                    id="acreage"
                    name="acreage"
                    required
                    placeholder="e.g. 15"
                    className="form-input"
                    value={formData.acreage}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="primaryProduce" className="form-label">
                  Primary Crops / Produce *
                </label>
                <input
                  type="text"
                  id="primaryProduce"
                  name="primaryProduce"
                  required
                  placeholder="e.g. Robusta Coffee, Black Pepper, Fresh Cardamom"
                  className="form-input"
                  value={formData.primaryProduce}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    WhatsApp / Contact Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="farmer@kisanmarket.in"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="isOrganic" className="form-label">
                    Farming Method
                  </label>
                  <select
                    id="isOrganic"
                    name="isOrganic"
                    className="form-select"
                    value={formData.isOrganic}
                    onChange={handleChange}
                  >
                    <option value="yes">100% Certified Organic</option>
                    <option value="conversion">In Conversion to Organic</option>
                    <option value="natural">Natural Zero-Budget (ZBNF)</option>
                    <option value="gap">GAP / Integrated Pest Management</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="isGiTagged" className="form-label">
                    GI-Tagged Crop Eligible?
                  </label>
                  <select
                    id="isGiTagged"
                    name="isGiTagged"
                    className="form-select"
                    value={formData.isGiTagged}
                    onChange={handleChange}
                  >
                    <option value="no">Not Applicable</option>
                    <option value="yes">Yes, Registered GI Produce</option>
                    <option value="applying">Applying for GI Certificate</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-submit-vendor">
                <Sprout size={18} />
                <span>Submit Grower Verification Request</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="vendor-submission-success">
            <div className="success-icon-badge">
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>
            <h2 className="success-title">Verification Request Received</h2>
            <p className="success-body">
              Thank you, <strong>{formData.growerName}</strong>. Your onboarding file for <strong>{formData.farmName}</strong> in <strong>{formData.district}</strong> has been logged into our agricultural verification queue.
              <br /><br />
              Our local Kerala agrarian field officer will contact you at <strong>{formData.phone}</strong> within 2 business days to schedule soil & plot geolocation verification.
            </p>
            <button type="button" className="btn-close-success" onClick={handleModalClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BecomeVendorModal;
