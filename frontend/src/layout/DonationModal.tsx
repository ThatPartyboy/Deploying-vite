// src/components/DonationModal/DonationModal.tsx
import React from 'react';

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (donation: Donation) => void;
    existingDonation?: Donation;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, onSave, existingDonation }) => {
    // Logic for handling the form for adding/editing/deleting donations

    return (
        isOpen && (
            <div className="modal">
                <div className="modal-content">
                    <h2>{existingDonation ? 'Edit Donation' : 'Add Donation'}</h2>
                    <form onSubmit={/* form submission logic */}>
                        {/* Form fields */}
                        <button type="submit">Save</button>
                        <button onClick={onClose}>Cancel</button>
                    </form>
                </div>
            </div>
        )
    );
};

export default DonationModal;
