// src/components/DonationCard/DonationCard.tsx
import React from 'react';

interface DonationCardProps {
    donation: Donation;
}

const DonationCard: React.FC<DonationCardProps> = ({ donation }) => {
    return (
        <div className="donation-card">
            <h3>{donation.title}</h3>
            <p>{donation.date}</p>
            {/* Other donation details */}
        </div>
    );
};

export default DonationCard;
